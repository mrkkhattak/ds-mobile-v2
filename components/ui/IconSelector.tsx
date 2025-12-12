import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { IconItem } from "@/app/types/types";
import { BathIcon, BayLeafIcon, ClothesHangerIcon, VaccumCleaner } from "@/assets/taskIcons/TaskIcons";
import { Ionicons } from "@expo/vector-icons";

const icons:IconItem[] = [
  { id: 1, name: "bath", component: BathIcon },
  { id: 2, name: "bayLeaf", component: BayLeafIcon },
  { id: 3, name: "hanger", component: ClothesHangerIcon },
  { id: 4, name: "vacuum", component: VaccumCleaner },
  { id: 5, name: "hanger2", component: ClothesHangerIcon },
];

export default function IconSelector({handleSelect,selectedValue}:{handleSelect: (value:string) => void,selectedValue?:string}) {
  const scrollRef = useRef<ScrollView>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };
console.log("selectedValue",selectedValue)
  useEffect(() => {
  if (selectedValue) {
    const found = icons.find((i) => i.name === selectedValue)?.id;
    setSelected(found ||null);
  }
}, [selectedValue]);

  return (
    <View style={styles.container}>
      {/* Left Arrow */}
      <TouchableOpacity style={styles.arrowBtn} onPress={scrollLeft}>
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Icon List */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.iconList}
      >
        {icons.map((item) => {
          const IconComp = item.component;
          const isSelected = selected === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => { setSelected(item.id); handleSelect(item.name)}}
              style={[styles.iconWrapper, isSelected && styles.selected]}
            >
              <IconComp width={20} height={20} fill={isSelected ? "#fff" : "#444"} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Right Arrow */}
      <TouchableOpacity style={styles.arrowBtn} onPress={scrollRight}>
        <Ionicons name="chevron-forward" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    
  },

  iconList: {
    justifyContent:"center"
  },

  iconWrapper: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 12,
    backgroundColor: "#fff",
  },

  selected: {
    // backgroundColor: "#007bff",
    borderColor: "rgba(157, 146, 207, 1)",
    borderWidth:2
  },

  arrowBtn: {
    // padding: 8,
  },
});
