import React from "react";
import { StyleSheet, View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import { SlideButton } from "../ui/Buttons";

import SlideIcon from "../../assets/images/icons/arrow.svg";
interface CalenderStripComponetProps {
  navigation: any;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  today: Date;
}
const CalenderStripComponet = (props: CalenderStripComponetProps) => {
  const { navigation, selectedDate, setSelectedDate, today } = props;
  return (
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
          navigation.navigate("TaskLibrary");
        }}
        viewStyle={{ marginVertical: 20 }}
        textStyle={{
          fontSize: 16,
          fontWeight: "700",
          textAlign: "center",
        }}
      />
    </View>
  );
};

export default CalenderStripComponet;

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
