import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { StackScreenProps } from "@react-navigation/stack";

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  username: string;
  userId: string;
  videoUri: string;
  likes: number;
  createdAt: any;
}

export type StackNavigatorParamsList = {
  Home: undefined;
  VideoDetail: { video: VideoItem };
  Upload: undefined;
};

export type AuthStackParamsList = {
  Login: undefined;
  Register: undefined;
};

export type TabNavigatorParamsList = {
  HomeStack: undefined;
  Upload: undefined;
  Favorites: undefined;
  Profile: undefined;
  Location: undefined;
};

export type StackNavProps<T extends keyof StackNavigatorParamsList> = 
  StackScreenProps<StackNavigatorParamsList, T>;

export type AuthStackNavProps<T extends keyof AuthStackParamsList> = 
  StackScreenProps<AuthStackParamsList, T>;

export type TabNavProps<T extends keyof TabNavigatorParamsList> = 
  BottomTabScreenProps<TabNavigatorParamsList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackNavigatorParamsList, AuthStackParamsList, TabNavigatorParamsList {}
  }
}
