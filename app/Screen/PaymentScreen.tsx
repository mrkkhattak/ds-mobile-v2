import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import GradientProgressBar from "@/components/ui/GradentProgress";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import StartIcons from "../../assets/images/icons/Stars.svg";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "PaymentScreen"
>;

const PaymentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const progress = 0.99;
  const [selected, setSelected] = useState<string | null>("ANNUAL");

  const plans = [
    { key: "WEEKLY", title: "WEEKLY", price: "$1.99/pw" },
    {
      key: "ANNUAL",
      title: "ANNUAL",
      price: "$24.99/py",
      oldPrice: "$103.48",
      discount: "75% OFF",
      tag: "Most Popular",
    },
    {
      key: "MONTHLY",
      title: "MONTHLY",
      price: "$5.99/pm",
      discount: "30% OFF",
    },
  ];

  const handleSubmit = () => {
    if (!selected) {
      Alert.alert("Validation", "Please select at least one plan.");
      return;
    }
    // Continue to next step here
    navigation.navigate("HereWhatWaitingForYouScreen");
  };

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Progress */}
        <View style={styles.progressRow}>
          <GradientProgressBar
            progress={progress}
            width={Platform.OS === "ios" ? 300 : 285}
          />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>

        {/* Headings */}
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <MainHeading>Your future self is thanking you already</MainHeading>
          <View style={{ marginTop: 20 }}>
            <StartIcons />
          </View>
          <SubtitleText style={{ marginTop: 20 }}>
            Select a billing option
          </SubtitleText>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => {
            const isSelected = selected === plan.key;
            return (
              <Pressable
                key={plan.key}
                onPress={() => setSelected(plan.key)}
                style={{ width: "100%", alignItems: "center" }}
              >
                <View
                  style={[
                    styles.cardBorder,
                    {
                      height: 120,
                      padding: 2,
                      borderRadius: 16,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardInner,
                      {
                        borderWidth: isSelected ? 5 : 2,
                        borderColor: isSelected ? "#8DE016" : "#8DE016",
                      },
                    ]}
                  >
                    {isSelected && plan.tag && (
                      <View style={styles.mostPopularTag}>
                        <Text style={styles.mostPopularText}>{plan.tag}</Text>
                      </View>
                    )}

                    <View style={styles.cardContent}>
                      <View>
                        <Text style={styles.planTitle}>{plan.title}</Text>
                        {plan.oldPrice && (
                          <Text style={styles.oldPrice}>{plan.oldPrice}</Text>
                        )}
                        <Text style={styles.planPrice}>{plan.price}</Text>
                      </View>

                      <View style={styles.rightSide}>
                        {plan.discount && (
                          <View
                            style={[
                              styles.discountBadge,
                              {
                                backgroundColor: isSelected
                                  ? "#F222BE"
                                  : "rgba(255,255,255,0.2)",
                              },
                            ]}
                          >
                            <Text style={styles.discountText}>
                              {plan.discount}
                            </Text>
                          </View>
                        )}

                        <Checkbox
                          value={isSelected}
                          onValueChange={() => setSelected(plan.key)}
                          color={isSelected ? "#00C048" : undefined}
                          style={styles.checkbox}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Button + Footer */}
        <View
          style={{
            flexGrow: 1,
            justifyContent: "flex-end",
            width: "100%",
            marginTop: 32,
          }}
        >
          <MainButton
            onPress={handleSubmit}
            label="GET SPRUCING"
            style={{ marginBottom: 10 }}
          />
          <View style={styles.footerRow}>
            <SubtitleText style={{ marginTop: 10 }}>
              Cancel anytime
            </SubtitleText>
            <SubtitleText style={{ marginTop: 10 }}>
              Restore purchases
            </SubtitleText>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  plansContainer: {
    marginTop: 32,
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  cardBorder: {
    width: 287,
  },
  cardInner: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  mostPopularTag: {
    position: "absolute",
    top: -5,
    left: 0,
    backgroundColor: "#8DE016",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  mostPopularText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  oldPrice: {
    color: "#aaa",
    textDecorationLine: "line-through",
    fontSize: 13,
  },
  planPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  rightSide: {
    alignItems: "flex-end",
  },
  discountBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
