import { useAuth } from '@/hooks/use-auth';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderMenu } from './header-menu-btn';

export default function CustomHeader() {
    // Este hook ajuda a evitar que o conteúdo do cabeçalho fique atrás da barra de status ou do "notch" em iPhones
    const { top } = useSafeAreaInsets();
    const { user, logout } = useAuth();

    return (
        <View style={{ paddingTop: top }} className="bg-blue-400 shadow-md justify-center">
            <View className="px-5 py-8 flex-row justify-between items-center">
                {/* Lado Esquerdo: Saudação */}
                <View className="flex-row items-center">
                    <View className="w-16 h-16 bg-white rounded-full justify-center items-center">
                        <Text className="text-black-400 text-xl font-bold">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
                        </Text>
                    </View>
                    <View className="ml-3">
                        <Text className="text-white">Olá,</Text>
                        <Text className="text-white text-xl font-bold">{user?.name || 'Renan'}</Text>
                    </View>
                </View>

                {/* Lado Direito: Ícones */}
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity 
                  className='w-10 h-10 bg-white rounded-full justify-center items-center'
                 onPress={() => {
                    console.log("Abrir notificações"); 
                   // Aqui no futuro você coloca: router.push("/notifications")
                 }}
>
    <FontAwesome5 name="bell" size={20} color="rgba(0, 0, 0, 1)" />
</TouchableOpacity>

                    <HeaderMenu />
                </View>
            </View>
        </View>
    );
};