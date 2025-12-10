import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";

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
      }}
    >
      <CalendarStrip
        key={1212}
        style={[
          Platform.OS === "android"
            ? { ...styles.calendarStrip, width: 340 }
            : styles.calendarStrip,
        ]}
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
    </View>
  );
};

export default CalenderStripComponet;

const styles = StyleSheet.create({
  calendarStrip: {
    height: 60,
    width: 370,
    borderRadius: 20,

    backgroundColor: "rgba(224, 207, 243, 0.5)",
  },
  calendarHeaderStyle: {
    color: "#610FE0",
    textAlign: "left",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 30,
    width: "100%",
    fontSize: 16,
    display: "none",
  },
  dateNumberStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 17,
    // display: "none",
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
    // display: "none",
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
