import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { carregarPedidos } from './helpers'; // Importa a função

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosCarregados = await carregarPedidos();
      setPedidos(pedidosCarregados);
    };
    fetchPedidos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenHeader}>Seus Pedidos</Text>

      {pedidos.length > 0 ? (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.pedidoContainer}>
              <Text style={styles.pedidoTitle}>{item.title}</Text>
              <Text style={styles.pedidoDescription}>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPedidos}>Nenhum pedido encontrado.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  screenHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pedidoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  pedidoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pedidoDescription: {
    fontSize: 16,
    color: '#666',
  },
  noPedidos: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  },
});
