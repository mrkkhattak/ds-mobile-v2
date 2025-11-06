import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import FeatureCard from "@/components/ui/FeatureCard";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { AuthStackParamList } from "../types/navigator_type";

// Import your SVG icons
import Icon1 from "../../assets/images/icons/Library.svg";
import Icon3 from "../../assets/images/icons/Shuffle (1).svg";
import Icon2 from "../../assets/images/icons/Shuffle.svg";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "HereWhatWaitingForYouScreen"
>;

const HereWhatWaitingForYouScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const features = [
    {
      id: "1",
      Icon: Icon1,
      label: "Task Library",
      description:
        "Store your go‑to tasks, grab new ideas or select ready-made packs to save the thinking",
    },
    {
      id: "2",
      Icon: Icon2,
      label: "Assign Tasks",
      description:
        "Hit shuffle and let the app automatically assign tasks to keep things fair and fast.",
    },
    {
      id: "3",
      Icon: Icon3,
      label: "Invite Members",
      description:
        "Invite your cleaning crew to join and share the load together.",
    },
  ];

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <MainHeading>Here’s what’s waiting for you!</MainHeading>
        </View>

        {/* Horizontal Feature Cards */}
        <View style={styles.listWrapper}>
          <FlatList
            data={features}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FeatureCard
                Icon={item.Icon}
                label={item.label}
                description={item.description}
              />
            )}
          />
        </View>

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <MainButton
            onPress={() => navigation.navigate("HereWhatWaitingForYouScreen")}
            label="INVITE YOUR CLEANING CREW"
            style={{ marginBottom: 10 }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CreateYourAccountScreen");
            }}
          >
            <SubtitleText style={{ marginTop: 10, marginBottom: 10 }}>
              Skip
            </SubtitleText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default HereWhatWaitingForYouScreen;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  listWrapper: {
    marginTop: 50,
    flex: 1,
  },
  buttonWrapper: {
    flexGrow: 1,
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 32,
  },
});
