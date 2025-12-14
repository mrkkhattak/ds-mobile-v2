import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ClockIcon,
  FireIcon,
  Star,
} from "@/assets/taskIcons/FlashbackScreenIcons";

import MainLayout from "@/components/layout/MainLayout";
import WeeklyStatsCard from "@/components/WeeklyStatsCard";
import { useAuthStore } from "@/store/authstore";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";

import { useUserProfileStore } from "@/store/userProfileStore";
import {
  fetchSpruceTasksByAssignedUserId,
  getLongestSweepStreak,
  getProfilesByHousehold,
  getTotalSweepTime,
} from "../functions/functions";

const FlashbackScreen = () => {
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigation();
  const [formattedTime, setFormattedTime] = useState<string>("…");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  const { profile } = useUserProfileStore();
  // Fetch total points
  const getAnalytics = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      // Total points
      const { totalEffortPoints, error: pointsError } =
        await fetchSpruceTasksByAssignedUserId(user.id);

      if (pointsError) {
        console.error("Failed to fetch analytics:", pointsError);
        setTotalPoints(0);
      } else {
        setTotalPoints(totalEffortPoints ?? 0);
      }

      // Longest streak
      const streak = await getLongestSweepStreak(user.id);
      setLongestStreak(streak);

      // Total sweep time
      const formattedTime = await getTotalSweepTime(user.id); // e.g., "73 mins" or "1.22 hrs"

      // Convert formattedTime to numeric minutes
      let totalMinutes = 0;
      if (formattedTime) {
        const [value, unit] = formattedTime.split(" ");
        totalMinutes =
          unit === "hrs" ? parseFloat(value) * 60 : parseFloat(value);
      }

      // Get profiles by household
      const { data: profiles, error: profilesError } =
        await getProfilesByHousehold(profile?.household_id || "");
      const profilesCount = profiles?.length ?? 0;
      console.log("profilesCount", profilesCount, profile);
      // Multiply totalMinutes by number of profiles
      const multipliedTimeMinutes = totalMinutes * profilesCount;
      console.log("multipliedTimeMinutes", multipliedTimeMinutes);
      // Format final display time
      const finalFormattedTime =
        multipliedTimeMinutes < 59
          ? `${Math.round(multipliedTimeMinutes)} mins`
          : `${(multipliedTimeMinutes / 60).toFixed(2)} hrs`;

      setFormattedTime(finalFormattedTime);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setTotalPoints(0);
      setLongestStreak(0);
      setFormattedTime("0 mins");
    }

    setLoading(false);
  };

  // Fetch sweep dates and calculate longest streak

  // Initial load
  // Initial load
  useEffect(() => {
    getAnalytics();
  }, [user?.id]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getAnalytics();
    }, [user?.id])
  );

  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Flashback</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("MainMenu" as never)}
          >
            <MenuIcon />
          </TouchableOpacity>
        </View>

        <Text style={styles.screenSubTitle}>
          Check in on your progress & celebrate your wins!
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Weekly Points Card */}
          <View style={styles.card}>
            <View style={styles.badge}>
              <Star />
            </View>

            <View style={styles.row}>
              <Text style={styles.points}>{loading ? "…" : totalPoints}</Text>

              {/* Placeholder for week-over-week increase */}
              {/* <View style={styles.increase}>
                <Text style={styles.arrow}>↑</Text>
                <Text style={styles.increaseText}>0</Text>
              </View> */}
            </View>

            <Text style={styles.label}>Weekly Points</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
              <View style={styles.statsIconRing}>
                <FireIcon />
              </View>

              <View>
                <View style={styles.statsValueRow}>
                  <Text style={styles.statsValue}>{longestStreak}</Text>
                  <Text style={styles.statsUnit}> days</Text>
                </View>
                <Text style={styles.statsLabel}>Longest Streak</Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statsIconRing}>
                <ClockIcon />
              </View>

              <View>
                <View style={styles.statsValueRow}>
                  <Text style={styles.statsValue}>
                    {loading ? "…" : formattedTime.split(" ")[0]}
                  </Text>
                  <Text style={styles.statsUnit}>
                    {loading ? "" : formattedTime.split(" ")[1]}
                  </Text>
                </View>
                <Text style={styles.statsLabel}>Saved on Weekends</Text>
              </View>
            </View>
          </View>

          <WeeklyStatsCard assignedUserId={user?.id || ""} />
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default FlashbackScreen;

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  screenSubTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 6,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#9B7AE4",
    borderRadius: 24,
    height: 160,
    padding: 20,
    justifyContent: "center",
    marginBottom: 10,
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  points: {
    fontSize: 44,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 12,
  },
  increase: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4ADE80",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  increaseText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statsCard: {
    flex: 1,
    height: 200,
    backgroundColor: "#9B7AE4",
    borderRadius: 28,
    padding: 20,
    justifyContent: "flex-end",
  },
  statsIconRing: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statsValue: {
    fontSize: 44,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 70,
  },
  statsUnit: {
    fontSize: 28,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  statsLabel: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "500",
    color: "#FFFFFF",
    opacity: 0.95,
  },
});
