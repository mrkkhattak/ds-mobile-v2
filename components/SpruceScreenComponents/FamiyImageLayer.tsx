import React from "react";
import { Image, StyleSheet, View } from "react-native";

const FamiyImageLayer = () => {
  return (
    <View
      style={{
        zIndex: 0,
        position: "absolute",
        top: 300, // move down from top
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
  );
};

export default FamiyImageLayer;

const styles = StyleSheet.create({});
