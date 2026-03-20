import { Platform, View, Pressable } from "react-native";

let MotiView: any = View;
let MotiPressable: any = Pressable;

if (Platform.OS !== "web") {
    const moti = require("moti");
    const motiInteractions = require("moti/interactions");

    MotiView = moti.MotiView;
    MotiPressable = motiInteractions.MotiPressable;
}

export { MotiView, MotiPressable };