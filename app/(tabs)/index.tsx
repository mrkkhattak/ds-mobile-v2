import MainLayout from "@/components/layout/MainLayout";
import { SlideButton } from "@/components/ui/Buttons";
import DateLabel from "@/components/ui/DateLabel";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import { useAuthStore } from "@/store/authstore";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import LibrarIcon from "../../assets/images/icons/Group 1.svg";
import LimeIcon from "../../assets/images/icons/Lime.svg";
import SlideIcon from "../../assets/images/icons/arrow.svg";
import { fetchAndGroupTasks } from "../functions/functions";
const index = () => {
  const { signOut } = useAuthStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);
  const user = useAuthStore((s) => s.user);
  const [selectedDate, setSelectedDate] = useState<Date | undefined | any>(
    new Date()
  );
  const [isToday, setIsToday] = useState<Boolean>(false);
  const [groupData, setGroupData] = useState<any>();
  const today = new Date();

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchAndGroupTasks();
        console.log("result", result);
        if (result) {
          setGroupData(result);
        }
      } catch (err) {
        console.log("Error loading tasks:", err);
      }
    })();
  }, []);

  return (
    <MainLayout>
      <View style={{}}>
        <View style={{ marginTop: 60, paddingHorizontal: 40 }}></View>
        <View style={{}}>
          <View style={{ marginHorizontal: 20, marginTop: 40 }}>
            <MainHeading style={{ textAlign: "left" }}>
              Daily Spruce
            </MainHeading>
          </View>
          <SecondryHeading
            style={{
              textAlign: "left",
              color: "white",
              fontWeight: "300",
              fontFamily: "inter",
              fontSize: 14,
              marginHorizontal: 20,
            }}
          >
            SMALL STEPS. BIG IMPACT!
          </SecondryHeading>
        </View>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
          flex: 1,
        }}
      >
        <CalendarStrip
          key={1212}
          style={styles.calendarStrip}
          calendarHeaderStyle={styles.calendarHeaderStyle}
          dateNumberStyle={styles.dateNumberStyle}
          dateNameStyle={styles.dateNameStyle}
          highlightDateNumberStyle={styles.highlightDateNumberStyle}
          highlightDateNameStyle={styles.highlightDateNameStyle}
          highlightDateContainerStyle={{
            backgroundColor: "#FFFFFF",
            borderRadius: 50,
          }}
          selectedDate={selectedDate ? selectedDate : today}
          onDateSelected={(date: any) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset to midnight for accurate comparison
            const selected = new Date(date);

            if (selected < today) {
              setSelectedDate(date);
              return; // Prevent selecting past dates
            }

            setSelectedDate(date);
          }}
          calendarColor={"#E0CFF3"}
          iconLeft={require("../../assets/rightArrow.png")} // Left arrow icon
          iconRight={require("../../assets/Arrow_right.png")} // Right arrow icon
        />

        <SlideButton
          label="Slide to start sprucing"
          icon={<SlideIcon />}
          onSlideComplete={() => {
            console.log("Slide complete!");
            bottomSheetRef.current?.expand(); // 👈 opens the bottom sheet
          }}
          viewStyle={{ marginVertical: 20 }}
          textStyle={{ fontSize: 16, fontWeight: "700", textAlign: "center" }}
        />
      </View>
      <View
        style={{
          flex: 2,
          backgroundColor: "white",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
        }}
      >
        <DateLabel selectedDate={selectedDate} />
        <View
          style={{
            paddingHorizontal: 40,
            marginTop: 20,
          }}
        >
          {groupData ? (
            <FlatList
              data={Object.keys(groupData)}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 180 }}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 20 }}>
                  {/* Category Title */}
                  <Text
                    style={{
                      color: "#610FE0",
                      fontWeight: "700",
                      fontSize: 16,
                      marginBottom: 10,
                    }}
                  >
                    {item.toUpperCase()}
                  </Text>

                  {/* Render each task inside the category */}
                  <FlatList
                    data={groupData[item]}
                    keyExtractor={(task) => task.id}
                    scrollEnabled={false}
                    renderItem={({ item: task }) => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#F7F6FB",
                          borderRadius: 20,
                          padding: 16,
                        }}
                        key={task.name}
                      >
                        {/* Left side: icon + name */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#E6E0F8",
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text>🍽️</Text>
                          </View>
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#000",
                              fontWeight: "500",
                            }}
                          >
                            {task.name}
                          </Text>
                        </View>

                        {/* Right side: effort icons + avatar */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {Array.from({
                            length: Math.min(3, Math.ceil(task.points / 30)),
                          }).map((_, i) => (
                            <LimeIcon />
                          ))}
                          <Image
                            source={{
                              uri: "https://randomuser.me/api/portraits/women/44.jpg",
                            }}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 17,
                              marginLeft: 4,
                            }}
                          />
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}
            />
          ) : (
            <>
              <MainHeading
                style={{
                  color: "#6915E0",
                  fontWeight: "700",
                  fontSize: 20,
                  lineHeight: 36,
                  fontFamily: "inter",
                }}
              >
                Need a head start?
              </MainHeading>
              <SecondryHeading
                style={{
                  fontSize: 16,
                  lineHeight: 22,
                  fontWeight: "300",
                  fontFamily: "inter",
                }}
              >
                Open your Task Library to create your list in seconds and start
                sprucing without overthinking
              </SecondryHeading>
            </>
          )}

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <LibrarIcon />
          </View>
          {/* <MainButton
            onPress={() => {
              signOut();
            }}
            label="LOGOUT"
          /> */}
        </View>
      </View>
    </MainLayout>
  );
};

export default index;

const styles = StyleSheet.create({
  calendarStrip: {
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    width: 380,
    borderRadius: 30,
    opacity: 6,
  },
  calendarHeaderStyle: {
    color: "#610FE0",
    textAlign: "left",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 30,
    width: "100%",
    fontSize: 16,
  },
  dateNumberStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 17,
  },
  dateNameStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 17,
  },
  highlightDateNumberStyle: {
    color: "#610FE0",
    fontSize: 14,
    lineHeight: 17,
  },
  highlightDateNameStyle: {
    color: "#610FE0",
    fontSize: 14,
    lineHeight: 17,
  },
  highlightDateContainerStyle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    fontSize: 16,
  },
  disabledDateContainerStyle: {
    backgroundColor: "red", // Remove background for past dates
    borderWidth: 0, // Remove any outline
  },
});
