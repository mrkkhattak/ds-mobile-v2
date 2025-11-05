import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authstore';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const setIsPasswordRecovery = useAuthStore((s) => s.setIsPasswordRecovery);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;
        const type = params.type as string;

        if (!accessToken || !refreshToken) {
          Alert.alert('Error', 'Invalid authentication link');
          router.replace('/(tabs)');
          return;
        }

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          Alert.alert('Error', error.message || 'Failed to authenticate');
          router.replace('/(tabs)');
          return;
        }

        if (data?.session) {
          if (type === 'signup') {
            Alert.alert(
              'Success',
              'Email confirmed successfully! Welcome to the app.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)'),
                },
              ]
            );
          } else if (type === 'recovery') {
            // Password reset flow
            setIsPasswordRecovery(true);
            // The AuthNavigator will show ResetPasswordScreen
          }
        }
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Something went wrong');
        router.replace('/(tabs)');
      }
    };

    handleCallback();
  }, [params, router, setIsPasswordRecovery]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8C50FB" />
      <Text style={styles.text}>Verifying your account...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDC2F9',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#342868',
    fontFamily: 'Poppins-Medium',
  },
});
