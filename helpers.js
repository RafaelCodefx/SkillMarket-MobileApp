import AsyncStorage from '@react-native-async-storage/async-storage';

export const carregarPedidos = async () => {
  try {
    const pedidosSalvos = await AsyncStorage.getItem('pedidos');
    return pedidosSalvos ? JSON.parse(pedidosSalvos) : [];
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    return [];
  }
};

export const salvarPedido = async (pedido) => {
  try {
    const pedidosExistentes = await carregarPedidos();
    pedidosExistentes.push(pedido);
    await AsyncStorage.setItem('pedidos', JSON.stringify(pedidosExistentes));
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
  }
};
