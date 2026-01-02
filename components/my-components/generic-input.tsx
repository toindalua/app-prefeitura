import { EyeIcon, EyeOffIcon, Input, InputField } from '@gluestack-ui/themed';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface GenericInputProps {
    label: string;
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
    type?: 'text' | 'password';
    isRequired?: boolean;
    helperText?: string;
    // A prop 'error' substitui a função 'validate'
    error?: string | null;
}

export const GenericInput: React.FC<GenericInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    isRequired = false,
    helperText,
    // Recebe a mensagem de erro como uma string
    error,
}) => {
    // O estado de visibilidade da senha continua aqui
    const [visible, setVisible] = React.useState(false);

    // Não precisamos mais do 'handleChange' customizado, pois não há validação interna
    const toggleVisibility = () => setVisible(!visible);

    return (
        <View className="w-full mb-4">

            {/* Label */}
            <Text className="text-gray-700 font-medium mb-1 pl-3">
                {label} {isRequired && <Text className="text-blue-600">*</Text>}
            </Text>

            {/* Input */}
            {/* A borda agora depende da prop 'error' */}
            <Input variant="underlined" className={`relative px-2 py-1 border ${error ? 'border-blue-400' : 'border-gray-300'} rounded-full`}>
                <InputField
                    type={type === 'password' ? (visible ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    value={value}
                    // Passamos a função 'onChange' diretamente
                    onChangeText={onChange}
                    className="px-3 py-2 text-gray-900 pr-10"
                />

                {/* Ícone de visibilidade */}
                {type === 'password' && (
                    <TouchableOpacity
                        onPress={toggleVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-1"
                    >
                        {visible ? (
                            <EyeIcon height={24} width={24} />
                        ) : (
                            <EyeOffIcon height={24} width={24} />
                        )}
                    </TouchableOpacity>
                )}
            </Input>

            {/* Helper Text */}
            {helperText && !error && <Text className="text-gray-400 text-sm mt-1">{helperText}</Text>}

            {/* Error Text */}
            {/* O erro exibido agora vem diretamente da prop 'error' */}
            {error && (
                <View className="flex flex-row mt-1">
                    {/* <AlertCircleIcon color="$red500" size="xs"/> */}
                    <Text className="text-blue-400 text-sm">{error}</Text>
                </View>
            )}
        </View>
    );
};