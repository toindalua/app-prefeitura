import { useAuth } from '@/hooks/use-auth';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuItemLabel } from '../ui/menu';

export const HeaderMenu = () => {
    const { logout } = useAuth();
    return (
        <Menu
            placement="bottom" // Mudei para "bottom" que é mais comum em headers
            offset={5}
            trigger={({ onPress: onMenuPress, ...restOfTriggerProps }) => {
                // 1. Desestruturamos o onPress original das props e pegamos o resto.

                // 2. Criamos nossa própria função de clique.
                const handlePress = (event: GestureResponderEvent) => {
                    // Primeiro, executamos nossa lógica.
                    console.log('Menu button pressed');
                    
                    // Depois, executamos a lógica original do menu para que ele abra.
                    if (onMenuPress) {
                        onMenuPress(event);
                    }
                };

                return (
                    <TouchableOpacity
                        // 3. Usamos nossa nova função combinada aqui.
                        onPress={handlePress}
                        // 4. Passamos o restante das props necessárias.
                        {...restOfTriggerProps}
                        className="w-10 h-10 bg-white rounded-full justify-center items-center"
                    >
                        <FontAwesome5 name="bars" size={18} color="#b91c1c" />
                    </TouchableOpacity>
                );
            }}
        >
            <MenuItem key="profile" textValue="Meu Perfil">
                <FontAwesome5 name="user-alt" size={16} color="#4A5568" style={{ marginRight: 12 }} />
                <MenuItemLabel size="sm">Meu Perfil</MenuItemLabel>
            </MenuItem>
            <MenuItem key="settings" textValue="Configurações">
                <FontAwesome5 name="cog" size={16} color="#4A5568" style={{ marginRight: 12 }} />
                <MenuItemLabel size="sm">Configurações</MenuItemLabel>
            </MenuItem>
            <MenuItem key="logout" textValue="Sair" onPress={logout}>
                <FontAwesome5 name="sign-out-alt" size={16} color="#4A5568" style={{ marginRight: 12 }} />
                <MenuItemLabel size="sm">Sair</MenuItemLabel>
            </MenuItem>
        </Menu>
    );
};