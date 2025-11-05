import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export const RoomTag = ({ label, isSelected, onPress }: any) => (
  <TouchableOpacity
    style={[
      styles.roomTag,
      isSelected ? styles.roomTagSelected : styles.roomTagUnselected,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.roomTagText,
        isSelected ? { color: "#FFFFFF" } : { color: "42404E" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export const RoomSelector = ({
  selectedRooms,
  onToggleRoom,
  ALL_ROOMS,
}: any) => (
  <View
    style={{
      width: "90%",
      backgroundColor: "#F6F5F7", // A lighter purple for the cards
      borderRadius: 20,
      padding: 24,
      marginTop: 20,
      alignItems: "center",
    }}
  >
    <Text style={styles.cardTitle}>Select the rooms in your home</Text>
    <Text style={styles.cardSubtitle}>You can add more later</Text>
    <View style={styles.tagsContainer}>
      {ALL_ROOMS.map((room: any) => (
        <RoomTag
          key={room}
          label={room}
          isSelected={selectedRooms.includes(room)}
          onPress={() => onToggleRoom(room)}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  scroll: {},
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
  houseIconPlaceholder: {
    // Placeholder for the house icon image above the room card
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white", // Placeholder color
    position: "absolute",
    top: 60,
    zIndex: 1,
  },

  cardTitle: {
    color: "#42404E",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    color: "#42404E",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
  },

  // Tags Section Styles
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  roomTag: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    borderWidth: 1,
  },
  roomTagSelected: {
    backgroundColor: "#9B59B6", // Selected color (vibrant purple)
    borderColor: "#9B59B6",
  },
  roomTagUnselected: {
    backgroundColor: "#D9D9D9A6", // Unselected color (matching card background)
    borderColor: "#D9D9D9A6", // Light border
  },
  roomTagText: {
    color: "#42404E",
    fontWeight: "600",
    fontSize: 14,
  },
});
