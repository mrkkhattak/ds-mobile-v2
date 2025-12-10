import React from "react";
import { Image, StyleSheet, View } from "react-native";
interface FamliyLayer {
  groupData: any;
  open: any;
  value: any;
  items: any;
  setOpen: any;
  setValue: any;
  setItems: any;
}
const FamiyImageLayer = ({
  groupData,
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
}: FamliyLayer) => {
  return (
    <>
      <View
        style={{
          zIndex: 0,
          position: "absolute",
          top: 260, // move down from top
          alignSelf: "center",
        }}
      >
        <View>
          <Image
            source={require("../../assets/images/illustration.png")}
            resizeMode="cover"
            height={100}
            width={100}
          />
        </View>
        <View
          style={{
            zIndex: 1,
            position: "absolute",
            bottom: 5,
            alignSelf: "center",
          }}
        >
          <Image
            source={require("../../assets/images/Floor.png")}
            resizeMode="cover"
            height={100}
            width={100}
          />
        </View>
        <View
          style={{
            zIndex: 0,
            position: "absolute",
            bottom: 5,
            alignSelf: "center",
          }}
        >
          <Image
            source={require("../../assets/images/Floor2.png")}
            resizeMode="cover"
            height={100}
            width={100}
          />
        </View>
      </View>
    </>
  );
};

export default FamiyImageLayer;

const styles = StyleSheet.create({});
