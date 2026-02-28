import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";

interface MyButtonProps extends TouchableOpacityProps {}

const MyButton = (props: MyButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={{ ...styles.button, ...props.style }}>
      {props.children}
    </TouchableOpacity>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
});
