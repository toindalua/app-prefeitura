import CustomHeader from '@/components/layout/header-home';
import { Stack } from "expo-router";

// 2. Use o componente no seu layout
export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // Remova o "props" e o "{...props}"
          header: () => <CustomHeader />,
        }}
      />
      {/* Adicione outras telas que usarão o mesmo layout aqui, se necessário */}
    </Stack>
  );
}