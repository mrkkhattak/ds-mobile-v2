import {
  fetchSpruceTasksLast6Months,
  fetchSpruceTasksLast6Weeks,
  fetchSpruceTasksLast7Days,
} from "@/app/functions/functions";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const TABS = ["W", "6W", "6M"];
const MAX_BAR_HEIGHT = 180;

export default function WeeklyStatsCard({
  assignedUserId,
}: {
  assignedUserId: string;
}) {
  const [activeTab, setActiveTab] = useState("W");
  const [chartData, setChartData] = useState<
    { day: string; value: number; tasksCompleted: number }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      if (!assignedUserId) return;
      console.log("activetab", activeTab);
      switch (activeTab) {
        case "W":
          const weekRes = await fetchSpruceTasksLast7Days(assignedUserId);
          if (weekRes.dailyScores) {
            setChartData(
              weekRes.dailyScores.map((d) => ({
                day: d.day,
                value: d.value,
                tasksCompleted: d.tasksCompleted,
              }))
            );
          }
          break;

        case "6W":
          const weeksRes = await fetchSpruceTasksLast6Weeks(assignedUserId);
          console.log("weeksRes", weeksRes);
          if (weeksRes && Array.isArray(weeksRes)) {
            setChartData(
              weeksRes.map((d) => ({
                day: d.week, // Week 1, Week 2, …
                value: d.averageScore,
                tasksCompleted: d.tasksCompleted,
              }))
            );
          }
          break;

        case "6M":
          const monthsRes = await fetchSpruceTasksLast6Months(assignedUserId);
          if (monthsRes && Array.isArray(monthsRes)) {
            setChartData(
              monthsRes.map((d) => ({
                day: d.month, // Jul, Aug, …
                value: d.averageScore,
                tasksCompleted: d.tasksCompleted,
              }))
            );
          }
          break;
      }
    };

    loadData();
  }, [activeTab, assignedUserId]);

  console.log("cahttda", chartData);
  const maxValue = chartData.length
    ? Math.max(...chartData.map((d) => d.value))
    : 1;
  const totalPoints = chartData.reduce(
    (sum, d) => sum + d.value * d.tasksCompleted,
    0
  );
  const totalTasks = chartData.reduce((sum, d) => sum + d.tasksCompleted, 0);
  const avgPoints = totalTasks > 0 ? Math.round(totalPoints / totalTasks) : 0;
  console.log("avgPoints", avgPoints);
  return (
    <View style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.segment}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.segmentItem,
              activeTab === tab && styles.segmentActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === tab && styles.segmentTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>
              {activeTab === "W"
                ? "Your Week in Spruces"
                : activeTab === "6W"
                ? "Last 6 Weeks in Spruces"
                : "Last 6 Months in Spruces"}
            </Text>
            <Text style={styles.subtitle}>
              {activeTab === "W"
                ? "Last 7 Days"
                : activeTab === "6W"
                ? "Last 6 Weeks"
                : "Last 6 Months"}
            </Text>
          </View>

          <View style={styles.avgBox}>
            {/* <Text style={styles.avgValue}>
              {chartData.length
                ? Math.round(
                    chartData.reduce((sum, d) => sum + d.value, 0) /
                      chartData.length
                  )
                : 0}
            </Text> */}
            <Text style={styles.avgValue}>{avgPoints}</Text>
            <Text style={styles.avgLabel}>Avg{"\n"}pts</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Chart */}
        {/* Chart */}
        <View style={styles.chart}>
          {chartData.map((item, index) => {
            const barHeight = (item.value / maxValue) * MAX_BAR_HEIGHT;

            return (
              <View key={item.day + index} style={styles.barWrapper}>
                {item.value > 0 && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>
                      {Math.round(item.value)} pts
                    </Text>
                  </View>
                )}

                <LinearGradient
                  colors={["#9BE15D", "#00E3AE"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.bar, { height: Math.max(barHeight, 12) }]}
                />

                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  /* Segmented Control */
  segment: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "#5E2CE6",
  },
  segmentText: {
    color: "#9B9B9B",
    fontSize: 16,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5E2CE6",
  },
  subtitle: {
    fontSize: 14,
    color: "#9B9B9B",
    marginTop: 4,
  },

  avgBox: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avgValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#8ED34F",
    marginRight: 6,
  },
  avgLabel: {
    fontSize: 14,
    color: "#B5B5B5",
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#E6E6E6",
    marginVertical: 16,
  },

  /* Chart */
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 220,
  },

  barWrapper: {
    alignItems: "center",
    flex: 1, // take equal space
    marginHorizontal: 4, // small gap between bars
  },

  bar: {
    width: 26,
    borderRadius: 13,
  },

  dayLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#9B9B9B",
    fontWeight: "600",
  },

  /* Tooltip */
  tooltip: {
    position: "absolute",
    top: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  tooltipText: {
    color: "#8ED34F",
    fontWeight: "700",
    fontSize: 16,
  },
});
