import { GenericInput } from '@/components/my-components/generic-input';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth';
import { View, VStack } from '@gluestack-ui/themed';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native-gesture-handler';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const { showAlert } = useAlert()
    const { control, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await login(data.email, data.password);
            // console.log('Login bem-sucedido');
            showAlert('Login bem-sucedido!', 'success');
            router.replace('/home');
        } catch (error) {
            // console.error('Erro ao logar:', error);
            showAlert('Erro ao logar. Verifique suas credenciais e tente novamente.', 'error');
        }
    };

    return (
        <VStack className="p-4 space-y-0 bg-white w-full h-full pt-16">
            <View className="mb-8 w-full h-1/3 items-center justify-center">
                <Image
                    source={require('assets/images/logo.webp')}
                    style={{ width: '90%', height: '100%' }}
                    resizeMode="contain"
                />
            </View>
            <View className="flex flex-col gap-4">
                <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <GenericInput
                            label="Email"
                            value={field.value}
                            onChange={field.onChange} // Correto: react-hook-form controla a mudança
                            placeholder="Digite seu email"
                            type="text"
                            // Passe a mensagem de erro diretamente
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <GenericInput
                            label="Senha"
                            value={field.value}
                            onChange={field.onChange}
                            type="password"
                            placeholder="Digite sua senha"
                            // Passe a mensagem de erro diretamente
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <Button
                    variant="solid" size="lg" action="primary"
                    onPress={handleSubmit(onSubmit)}
                    className="bg-blue-500 w-full"
                >
                    <Text className="text-white text-center text-xl font-bold">Entrar</Text>
                </Button>
            </View>

        </VStack>
    );
}
