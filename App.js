import React, { useState, useEffect,  useRef, useMemo } from 'react'; 
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from "expo-av";
import api from './src/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import 'moment/locale/pt-br';

import { 
  View, 
  Alert,
  ActivityIndicator,
  FlatList, 
  Animated,
  ImageBackground,
  StyleSheet, 
  Text, 
  StatusBar, 
  Dimensions,
  Image, 
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button, 
  ScrollView 
} from 'react-native'; 
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable } from 'react-native';




// Dados simulados
const DATA = [
  {
    id: '1',
    title: 'Sou Um Cliente',
    icon: require('./assets/Cliente.png'),
    description: 'Conectamos você aos melhores profissionais locais.',
    href: 'Cliente',
  },
  {
    id: '2',
    title: 'Sou um Profissional',
    icon: require('./assets/Trabalhador.png'),
    description: 'Mostre seu talento para quem precisa, onde estiver.',
    href: 'Profissional',
  },
];

// Item da lista
const Item = ({ title, icon, navigation, href, description }) => (
  <View style={styles.item}>
    <Image source={icon} style={styles.image} />
    <View style={styles.itemContent}>
      <Text style={styles.title} onPress={() => navigation.navigate(href)}>{title}</Text>
      <Text style={styles.description} onPress={() => navigation.navigate(href)}>{description}</Text>
    </View>
  </View>
);

// Tela Home
function Home() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    const fetchNome = async () => {
      try {
          const token = await AsyncStorage.getItem('token'); // Recupera o token salvo após login
          if (!token) {
              console.error('Token não encontrado.');
              return;
          }
  
          const response = await api.get('/auth/me', {
              headers: { Authorization: `Bearer ${token}` } // Passa o token no cabeçalho
          });
  
          if (response.data && response.data.nome) {
              setNome(response.data.nome);
          }
      } catch (error) {
          console.error('Erro ao buscar nome do usuário:', error.response?.data || error.message);
      }
  };
  

    fetchNome();
  }, []);

  const categories = [
    {
      id: '1',
      icon: require('./assets/reparo.png'),
      name: 'Reparos, Construções e Serviços Gerais',
      services: [
        { id: '1', name: 'Calheiro', description: 'Instalação e manutenção de calhas', image: require('./assets/calheiro.png') },
        { id: '2', name: 'Eletricista', description: 'Instalações elétricas e reparos', image: require('./assets/eletric.png') },
        { id: '3', name: 'Pedreiro', description: 'Construção e reformas', image: require('./assets/pedreiro.png') },
        { id: '4', name: 'Encanador', description: 'Reparos hidráulicos', image: require('./assets/encanador.png') },
        { id: '5', name: 'Pintor', description: 'Pintura residencial e comercial', image: require('./assets/pintor.png') },
        { id: '6', name: 'Marceneiro', description: 'Móveis planejados e consertos', image: require('./assets/marceneiro.png') },
        { id: '7', name: 'Serralheiro', description: 'Portões, grades e estruturas metálicas', image: require('./assets/serralheiro.png') },
        { id: '8', name: 'Gesseiro', description: 'Forros e acabamentos em gesso', image: require('./assets/gesseiro.png') },
        { id: '9', name: 'Jardineiro', description: 'Cuidados e manutenção de jardins', image: require('./assets/jardineiro.png') },
        { id: '10', name: 'Chaveiro', description: 'Cópias de chaves e fechaduras', image: require('./assets/chaveiro.png') },
        { id: '11', name: 'Vidraceiro', description: 'Instalação e reparo de vidros', image: require('./assets/vidraceiro.png') },
        { id: '12', name: 'Montador de Móveis', description: 'Montagem e desmontagem de móveis', image: require('./assets/montador.png') },
        { id: '13', name: 'Dedetizador', description: 'Controle de pragas e insetos', image: require('./assets/dedetizador.png') },
        { id: '14', name: 'Soldador', description: 'Trabalhos em ferro e aço', image: require('./assets/soldador.png') },
        { id: '15', name: 'Instalador de Ar-Condicionado', description: 'Instalação e manutenção de ar-condicionado', image: require('./assets/arcondicionado.png') },
        { id: '16', name: 'Reparos Automotivos', description: 'Pequenos consertos e polimento', image: require('./assets/reparosauto.png') },
        { id: '17', name: 'Troca de Telhados', description: 'Troca e manutenção de telhados', image: require('./assets/telhado.png') },
        { id: '18', name: 'Limpador de Piscinas', description: 'Manutenção de piscinas', image: require('./assets/piscina.png') },
        { id: '19', name: 'Instalador de Câmeras', description: 'Monitoramento e segurança', image: require('./assets/cameras.png') },
        { id: '20', name: 'Lavagem de Sofás', description: 'Higienização de estofados', image: require('./assets/sofa.png') },
        { id: '21', name: 'Conserto de Geladeira', description: 'Reparos e manutenção de refrigeradores', image: require('./assets/geladeira.png') },
        { id: '22', name: 'Conserto de Máquinas de Lavar', description: 'Manutenção de lavadoras', image: require('./assets/lavadora.png') },
        { id: '23', name: 'Marido de Aluguel', description: 'Serviços gerais para casa', image: require('./assets/maridoaluguel.png') },
        { id: '24', name: 'Conserto de Fogão', description: 'Reparos e ajustes em fogões', image: require('./assets/fogao.png') },
        { id: '25', name: 'Carpinteiro', description: 'Trabalhos com madeira', image: require('./assets/carpinteiro.png') },
        { id: '26', name: 'Instalador de Antenas', description: 'Configuração de antenas', image: require('./assets/antenas.png') },
        { id: '27', name: 'Moto Táxi', description: 'Transporte rápido de passageiros', image: require('./assets/mototaxi.png') },
        { id: '28', name: 'Tecnico em telecom', description: 'Instalação e manutenção de redes de telecomunicações(wifi, rede moveis, fibra ótica, via radio, telefonia, voip, internet)', image: require('./assets/redes.png') },
        { id: '29', name: 'Limpador de Caixa d’Água', description: 'Higienização de reservatórios', image: require('./assets/caixadagua.png') },
        { id: '30', name: 'Conserto de Portões Automáticos', description: 'Reparo e manutenção', image: require('./assets/portao.png') },
      ],
    },
    {
      id: '2',
      icon: require('./assets/robotic-hand.png'),
      name: 'Tecnologia, Educação e Consultorias',
      services: [
        { id: '31', name: 'Professor Particular', description: 'Aulas individuais', image: require('./assets/teacher.png') },
        { id: '32', name: 'Programador', description: 'Desenvolvimento de sistemas', image: require('./assets/programador.png') },
        { id: '32', name: 'Consultor Jurídico', description: 'Orientação legal', image: require('./assets/juridico.png') },
        { id: '33', name: 'Desenvolvedor de Jogos', description: 'Criação de jogos digitais', image: require('./assets/games.png') },
        { id: '34', name: 'Especialista em Marketing Digital', description: 'Gestão de tráfego pago', image: require('./assets/marketing.png') },
        { id: '35', name: 'Analista de Dados', description: 'Interpretação de dados empresariais', image: require('./assets/dados.png') },
        { id: '36', name: 'Consultor de Finanças', description: 'Planejamento financeiro pessoal e empresarial', image: require('./assets/financeiro.png') },
        { id: '37', name: 'Instrutor de Idiomas', description: 'Aulas de inglês, espanhol e outros', image: require('./assets/idiomas.png') },
        { id: '38', name: 'Gestor de Redes Sociais', description: 'Criação de conteúdo para mídias sociais', image: require('./assets/redessocial.png') },
        { id: '39', name: 'Treinador de Oratória', description: 'Ajuda na comunicação e apresentação', image: require('./assets/oratoria.png') },
      ],
    },
      {
        id: '3',
        icon: require('./assets/home.png'),
        name: 'Imóveis, Veículos e Locações Gerais',
        services: [
          { id: '40', name: 'Aluguel e Venda de Casas', description: 'Casas para alugar e Comprar', image: require('./assets/house-rent.png') },
          { id: '41', name: 'Venda de Automóveis', description: 'Carros novos e usados', image: require('./assets/car-sale.png') },
          { id: '42', name: 'Corretores de Imóveis', description: 'Intermediação na compra e venda de imóveis', image: require('./assets/corretor.png') },
          { id: '43', name: 'Avaliação de Imóveis', description: 'Serviço de avaliação para venda ou financiamento', image: require('./assets/avaliacao-imovel.png') },
          { id: '44', name: 'Empreiteiras', description: 'Construção e reforma de imóveis', image: require('./assets/empreiteira.png') },
          { id: '45', name: 'Serviço de Mudanças', description: 'Fretes e transportes de mudanças', image: require('./assets/mudanca.png') },
          { id: '46', name: 'Locação de Salas Comerciais', description: 'Salas para aluguel para negócios', image: require('./assets/salas.png') },
          { id: '47', name: 'Locação de Equipamentos', description: 'Máquinas e equipamentos para construção', image: require('./assets/equipamentos.png') },
          { id: '48', name: 'Despachante', description: 'Documentação e regularização de veículos', image: require('./assets/despachante.png') },
          { id: '49', name: 'Chaveiro Automotivo', description: 'Troca e cópia de chaves de veículos', image: require('./assets/chaveiro-auto.png') },
          { id: '50', name: 'Autoelétrico', description: 'Serviços elétricos para veículos', image: require('./assets/autoeletrico.png') },
          { id: '51', name: 'Conserto de Estofados', description: 'Reparação de bancos e forros de carro', image: require('./assets/estofador.png') },
          { id: '52', name: 'Locação de Veículos', description: 'Aluguel de carros para viagens e trabalho', image: require('./assets/locacao-carro.png') },
          { id: '53', name: 'Mecânica Geral', description: 'Reparos mecânicos para todos os tipos de veículos', image: require('./assets/mecanica.png') },
          { id: '54', name: 'Instalação de Insulfilm', description: 'Aplicação de película protetora para veículos', image: require('./assets/insulfilm.png') },
          { id: '55', name: 'Conserto de Ar-Condicionado Automotivo', description: 'Manutenção e recarga de ar-condicionado', image: require('./assets/arauto.png') },
          { id: '56', name: 'Remoção de Amassados', description: 'Reparação de amassados sem pintura', image: require('./assets/remocao-amassado.png') },
          { id: '57', name: 'Pintura Automotiva', description: 'Serviço de pintura e polimento de carros', image: require('./assets/pintura-carro.png') },
          { id: '58', name: 'Borracharia 24h', description: 'Serviço de troca e conserto de pneus', image: require('./assets/borracharia.png') },
          { id: '59', name: 'Guincho', description: 'Reboque e assistência para veículos', image: require('./assets/guincho.png') },
          { id: '60', name: 'Troca de Óleo', description: 'Serviço de troca de óleo e revisão rápida', image: require('./assets/troca-oleo.png') },
          { id: '61', name: 'Instalação de Som e Multimídia', description: 'Personalização de som automotivo', image: require('./assets/som-carro.png') },
          { id: '62', name: 'Capotaria Automotiva', description: 'Reparos e personalização de capotas', image: require('./assets/capotaria.png') },
          { id: '63', name: 'Conserto de Moto', description: 'Mecânica especializada para motos', image: require('./assets/moto.png') },
          { id: '64', name: 'Revisão Automotiva', description: 'Check-up completo para veículos', image: require('./assets/revisao.png') },
          { id: '65', name: 'Martelinho de Ouro', description: 'Remoção de amassados sem pintura', image: require('./assets/martelinho.png') },
          { id: '66', name: 'Vistoria Veicular', description: 'Laudo para transferência e regularização de veículos', image: require('./assets/vistoria.png') },
          { id: '67', name: 'Lava Rápido', description: 'Lavagem automotiva completa', image: require('./assets/lavarapido.png') },
        ],
      },
      {
        id: '4',
        icon: require('./assets/better-health.png'),
        name: 'Saúde, Beleza e Bem-Estar',
        services: [
          { id: '68', name: 'Personal Trainer', description: 'Treinos personalizados', image: require('./assets/personal-trainer.png') },
          { id: '69', name: 'Nutricionista', description: 'Consultas de nutrição', image: require('./assets/nutritionist.png') },
          { id: '70', name: 'Psicólogo', description: 'Atendimento psicológico', image: require('./assets/psicologa.png') },
          { id: '71', name: 'Esteticista', description: 'Cuidados com a pele e estética', image: require('./assets/esteticista.png') },
          { id: '72', name: 'Massoterapeuta', description: 'Massagens terapêuticas', image: require('./assets/massoterapeuta.png') },
          { id: '73', name: 'Fisioterapeuta', description: 'Reabilitação e exercícios físicos', image: require('./assets/fisioterapia.png') },
          { id: '74', name: 'Pilates', description: 'Aulas de pilates para fortalecimento muscular', image: require('./assets/pilates.png') },
          { id: '75', name: 'Cabeleireiro', description: 'Cortes e tratamentos capilares', image: require('./assets/cabeleireiro.png') },
          { id: '76', name: 'Barbeiro', description: 'Cortes masculinos e barba', image: require('./assets/barbeiro.png') },
          { id: '77', name: 'Manicure e Pedicure', description: 'Cuidados com unhas', image: require('./assets/manicure.png') },
          { id: '78', name: 'Podólogo', description: 'Saúde dos pés', image: require('./assets/podologo.png') },
          { id: '79', name: 'Maquiadora', description: 'Serviços de maquiagem profissional', image: require('./assets/maquiagem.png') },
          { id: '80', name: 'Depilação', description: 'Depilação a cera e laser', image: require('./assets/depilacao.png') },
          { id: '81', name: 'Tatuador', description: 'Tatuagens e piercings', image: require('./assets/tatuador.png') },
          { id: '82', name: 'Terapeuta Holístico', description: 'Atendimento com técnicas naturais', image: require('./assets/holistico.png') },
          { id: '83', name: 'Dentista', description: 'Atendimento odontológico', image: require('./assets/dentista.png') },
          { id: '84', name: 'Oftalmologista', description: 'Exames e consultas oftalmológicas', image: require('./assets/oftalmo.png') },
          { id: '85', name: 'Quiropraxista', description: 'Correção postural e alívio de dores', image: require('./assets/quiropraxia.png') },
         
        ],
      },
    ];
  

  // Unifica todos os serviços em uma única lista ao carregar o componente
  useEffect(() => {
    const servicesList = categories.flatMap(category => category.services);
    setAllServices(servicesList);
    setFilteredServices(servicesList);
  }, []);

  // Filtragem dos serviços conforme o usuário digita
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter(service =>
        service.name.toLowerCase().includes(searchText.toLowerCase()) ||
        service.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchText, allServices]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.footerheader}>Olá, {nome}</Text>

        {/* Campo de Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder=" 🔍  O Que Precisa? "
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
              <Text style={styles.clearText}>✖</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de Serviços Filtrados */}
        {searchText.length > 0 ? (
          filteredServices.length > 0 ? (
            <FlatList
              data={filteredServices}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.serviceCard}
                  onPress={() => navigation.navigate('Prepararpedido', { service: item })}
                >
                  <Image source={item.image} style={styles.serviceImage} />
                  <View>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.serviceDescription}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noResults}>Nenhum serviço encontrado.</Text>
          )
        ) : (
          <>
            {/* Categorias */}
            
            <Text style={styles.sectionTitle}>Categorias</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <View key={category.id} style={styles.category}>
                  <Image source={category.icon} style={styles.categoryIcon} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              ))}
            </View>
{/*
            <View style={styles.pedidoContainer3}>
              <Pressable onPress={() => navigation.navigate('Delivery')}>
              <View style={styles.alinhar}>
              <Image source={require('./assets/entregador.png')} style={styles.imagePedir2} />
              <Image source={require('./assets/proximo.png')} style={styles.imageBack4} />
              </View>
              <Text style={styles.categoryText3}>Entrega Rápida</Text>
              </Pressable>
            </View>

            */}

            {/* Subcategorias */}
            <View style={styles.container2}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                navigation={navigation}
                renderItem={({ item }) => (
                  <View style={styles.categoryBox}>
                    <Text style={styles.categoryHeader}>{item.name}</Text>
                    <FlatList
                      data={item.services}
                      keyExtractor={(service) => service.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item: service }) => (
                        <Pressable onPress={() => navigation.navigate('Prepararpedido', { service })}>
                          <View style={styles.serviceCard}>
                            <Image source={service.image} style={styles.serviceIcon} />
                            <Text style={styles.serviceLabel}>{service.name}</Text>
                          </View>
                        </Pressable>
                      )}
                    />
                  </View>
                )}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

import RNPickerSelect from "react-native-picker-select";

import axios from 'axios'; // Importando Axios


function Delivery() {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);

  // 📌 Captura a localização do usuário ao abrir a tela
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão Negada", "Autorize o acesso à sua localização.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const enviarPedido = async () => {
    if (!valor || !tipo) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (!location) {
      Alert.alert("Erro", "Não foi possível obter sua localização.");
      return;
    }

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem("token"); // 📌 Obtendo o token do usuário autenticado
      const telefone = await AsyncStorage.getItem("telefone"); // 📌 Obtendo telefone salvo do usuário

      const response = await axios.post("https://backend-skillmarket.onrender.com/delivery/criar", {
        descricao: valor,
        tipo,
        telefone,
        latitude: location.latitude,
        longitude: location.longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` }, // Passando o token no cabeçalho da requisição
      });

      Alert.alert("Sucesso", "Pedido enviado com sucesso!");
      setValor("");
      setTipo("");
      navigation.navigate("Home"); // Volta para a tela inicial após enviar
    } catch (error) {
      console.error("Erro ao enviar pedido:", error.response?.data || error.message);
      Alert.alert("Erro", "Erro ao enviar pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={require("./assets/delivery-bike.png")} style={styles.imagePedir} />
        <Text style={styles.title}>O que deseja pedir?</Text>

        {/* Entrada de Valor */}
        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={24} color="#4CAF50" />
          <TextInput
            style={styles.input}
            placeholder="Descrição do pedido..."
            value={valor}
            onChangeText={setValor}
          />
        </View>

        {/* Seleção do Tipo */}
        <View style={styles.pickerContainer}>
          <Ionicons name="list-outline" size={24} color="#4CAF50" />
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(value) => setTipo(value)}
              placeholder={{ label: "Selecione o tipo de pedido...", value: "" }}
              items={[
                { label: "Comida", value: "Comida" },
                { label: "Farmácia", value: "Farmácia" },
                { label: "Mercado", value: "Mercado" },
                { label: "Outros", value: "Outros" },
              ]}
              style={{
                inputAndroid: styles.pickerText,
                inputIOS: styles.pickerText,
              }}
            />
          </View>
        </View>

        {/* Botão de Envio */}
        <TouchableOpacity style={styles.button} onPress={enviarPedido} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="send-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Enviar Pedido</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}


function Prepararpedido({ route, navigation }) {
  
  const { service } = route.params;
  return (
    
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => navigation.navigate('App')} style={styles.headerpedir}>
      <Image source={require('./assets/previous.png')} style={styles.imageBack}  />
      <Text style={styles.footerheaderPedidos2}>{service.name}</Text>
      </Pressable>
      <View style={styles.imageContainer}>
      <Image source={require('./assets/shopping-bag.png')} style={styles.imagePedir} />
      </View>
      <View  style={styles.container}>
      <Text style={styles.footerheaderPedidos}>Prepare-se para pedir!</Text>
      <Text style={styles.descriptionItem2}>Mas Antes, Aqui vai algumas Dicas:</Text>
      
      </View>
      <View style={styles.containerPedido} >
      <Icon name="lightbulb" size={20} color="#FFC107" style={styles.icon} />
      <View>
      <Text style={styles.categoryHeader2}>Como funciona?</Text>
      <Text style={styles.categoryText2}>Após clicar em iniciar solicitação iremos solicitar permissão a sua localização atual, assim podemos encontrar os profissionais mais proximos a você para um atendimento mais rápido.
      </Text>
      </View>
      </View>

      <View style={styles.containerPedido} >
      <Icon name="lightbulb" size={20} color="#FFC107" style={styles.icon} />
      <View>
      <Text style={styles.categoryHeader2}>Explique o que Você Precisa</Text>
      <Text style={styles.categoryText2}>Quanto mais detalhes sobre a sua solicitação, 
        mais profissionais poderão entrar em contato com você.
      </Text>
      </View>
      </View>

      <View style={styles.containerPedido} >
      <Icon name="timer" size={20} color="#1565C0" style={styles.icon} />
      <View>
      <Text style={styles.categoryHeader2}>Aguarde o contato dos profissionais</Text>
      <Text style={styles.categoryText2}>Levaremos seu pedido para que profissionais avaliados atendam a sua solicitação.
      </Text>
      </View>
      </View>
      
      <Pressable onPress={() => navigation.navigate('FormularioPedidos')}>
      <Text style={styles.iniciarsolic} >
        Iniciar Solicitação
        </Text>
        </Pressable>
        </ScrollView>
        
    </View>
    
  );
}

import MapView, { Marker } from 'react-native-maps';

function FormularioPedidos() {
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const [descricao, setDescricao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [area, setArea] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(true);

  const areasDisponiveis = [
    'Reparos, Construções e Serviços Gerais',
    'Tecnologia, Educação e Consultorias',
    'Imóveis, Veículos e Locações Gerais',
    'Saúde, Beleza e Bem-Estar',
  ];

  // 📍 Coletar localização do usuário quando a tela carregar
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão negada');
        setLoadingLocation(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoadingLocation(false);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!descricao || !telefone || !area) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!location) {
      Alert.alert("Erro", "Não foi possível obter sua localização.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const { latitude, longitude } = location;

      await api.post('/pedidos/criar', {
        descricao,
        latitude,
        longitude,
        telefone,
        area
      }, { headers: { Authorization: `Bearer ${token}` } });

      Alert.alert('Sucesso', 'Pedido enviado com sucesso!');
      navigation.navigate('App');
    } catch (error) {
      console.error('Erro ao criar pedido:', error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível enviar o pedido.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerGrow}>
      <Pressable onPress={() => navigation.navigate('App')} style={styles.headerpedir}>
        <Image source={require('./assets/previous.png')} style={styles.imageBack} />
      </Pressable>
      <View style={styles.imageContainer}>
        <Image source={require('./assets/happy.png')} style={styles.imagePedir} />
      </View>
      <Text style={styles.footerheaderPedidos2}>Faça seu Pedido Agora!</Text>

      <TextInput
        style={[styles.inputPedir, styles.textArea]}
        placeholder="Descreva o que você precisa com detalhes"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Text style={styles.label}>Telefone de Contato*</Text>
      <TextInput
        style={styles.inputPedir}
        placeholder="Ex: (99) 99999-9999"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      {/* Mapa e Localização */}
      <View style={{ height: 240, marginVertical: 10 }}>
        {loadingLocation ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <MapView
          style={{ flex:1, maxHeight:240, height:240}}
            region={location ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            } : {
              latitude: -23.5505, // Localização padrão (São Paulo)
              longitude: -46.6333,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => setLocation(e.nativeEvent.coordinate)}
          >
            {location && (
              <Marker coordinate={location} title="Local do Pedido" />
            )}
          </MapView>

        )}

      </View>
                    {/* Seleção de Categoria */}
                    <View style={styles.pickerContainer4}>
      <Picker
        selectedValue={area}
        onValueChange={(itemValue) => setArea(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {areasDisponiveis.map((area, index) => (
          <Picker.Item key={index} label={area} value={area} />
        ))}
      </Picker>
    </View>

    <TouchableOpacity style={styles.buttonPedir} onPress={handleSubmit}>
      <Text style={styles.buttonTextPedir}>Enviar Pedido</Text>
    </TouchableOpacity>
    </ScrollView>
  );
}

function Cliente({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setconfirmSenha] = useState('');

  const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const handleCadastro = async () => {
    if (!nome || !email || !telefone || !senha || !confirmSenha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (!validarEmail(email)) {
      alert('Digite um e-mail válido!');
      return;
    }

    if (senha !== confirmSenha) {
      alert('As senhas não coincidem');
      return;
    }

    // 🔹 Remover caracteres não numéricos do telefone
    const telefoneFormatado = telefone.replace(/\D/g, "");

    // 🔹 Verificar se tem exatamente 11 dígitos (padrão no Brasil)
    if (telefoneFormatado.length !== 11) {
      alert('O número de telefone deve ter exatamente 11 dígitos (DDD + número).');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        telefone: telefoneFormatado,  // Enviar o telefone formatado
        senha,
        tipoUsuario: 'cliente'
      });

      alert('Cadastro realizado com sucesso!');
      await AsyncStorage.setItem('nome', nome);
      await AsyncStorage.setItem('telefone', telefoneFormatado);
      await AsyncStorage.setItem('email', email);
      navigation.navigate('Login');  // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.centered]}>
      <View style={styles.loginContainer}>
        <Image source={require('./assets/Logo_.png')} style={styles.categoryIconLogin} />
        <Text style={styles.loginHeader}>Cadastro do Cliente</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Número de Telefone (WhatsApp)"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={true}
          value={senha}
          onChangeText={setSenha}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry={true}
          value={confirmSenha}
          onChangeText={setconfirmSenha}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>


        <Text style={styles.description}>Já tenho Conta!</Text>
      </View>
    </SafeAreaView>
  );
}


// Outras telas e navegação
const { width, height } = Dimensions.get('window');



const categories = ['Todas', 'Reformas e Reparos', 'Cuidados Estéticos', 'Educação', 'Saúde'];

import { useFocusEffect } from "@react-navigation/native";
function Explorar() {
  const BASE_URL = "https://backend-skillmarket.onrender.com";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const videoRefs = useRef([]);
  const [paused, setPaused] = useState({});

  // 🚀 Pausar todos os vídeos ao sair da tela
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setPaused({}); // 🔥 Zera os pausados
        videoRefs.current.forEach((video) => {
          if (video?.current) {
            video.current.pauseAsync(); // 🔥 Garante que o vídeo pare
          }
        });
      };
    }, [])
  );

  useEffect(() => {
    async function fetchVideos() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado.");
          return;
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permissão de localização negada");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await api.get(`/videos/listar?lat=${latitude}&lng=${longitude}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setVideos(response.data);
          videoRefs.current = response.data.map(() => React.createRef());
        } else {
          console.error("Erro: A resposta da API não é um array", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideo(viewableItems[0].index);
      setPaused({});
    }
  }).current;

  const togglePlayPause = (index) => {
    setPaused((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));

    if (videoRefs.current[index]?.current) {
      if (paused[index]) {
        videoRefs.current[index].current.playAsync();
      } else {
        videoRefs.current[index].current.pauseAsync();
      }
    }
  };

  const abrirWhatsAppComNumero = (telefone) => {
    if (!telefone) {
      Alert.alert("Erro", "Número de telefone não encontrado.");
      return;
    }

    const numeroFormatado = telefone.replace(/\D/g, ""); // 🔥 Remove caracteres não numéricos
    const url = `https://wa.me/55${numeroFormatado}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    });
  };

  const renderItem = ({ item, index }) => {
    const isPlaying = index === currentVideo && !paused[index];

    return (
      <View style={styles.videoContainer34}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity onPress={() => togglePlayPause(index)} activeOpacity={1}>
            <Video
              ref={videoRefs.current[index]}
              source={{ uri: item.video.startsWith("http") ? item.video : `${BASE_URL}/${item.video}` }}
              style={styles.video34}
              shouldPlay={isPlaying}
              isLooping
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Gradiente de fundo */}
        <LinearGradient colors={["rgba(0,0,0,0.5)", "transparent"]} style={styles.overlay} />

        {/* Informações do Criador */}
        <View style={styles.infoContainer34}>
          <Text style={styles.username34}>@{item.usuario?.nome || "Usuário Desconhecido"}</Text>
        </View>

        {/* Botão de Contato no WhatsApp */}
        <View style={styles.actionsContainer34}>
          <TouchableOpacity style={styles.actionButton34} onPress={() => abrirWhatsAppComNumero(item.usuario?.telefone)}>
            <Ionicons name="logo-whatsapp" size={34} color="white" />
            <Text style={styles.actionText34}>Contato</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container34}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : videos.length === 0 ? (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>Nenhum vídeo encontrado.</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item._id}
          snapToInterval={height}
          decelerationRate="fast"
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const Perfil = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(null)
  const [pedidos, setPedidos] = useState('')

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const storedNome = await AsyncStorage.getItem('nome');
              const storedTelefone = await AsyncStorage.getItem('telefone');
              console.log('Telefone armazenado: ', storedTelefone)
              const token = await AsyncStorage.getItem('token');

              if (storedNome) setNome(storedNome);
              if (storedTelefone) setTelefone(storedTelefone);

              // Buscar pedidos do usuário
              const response = await api.get('/pedidos/listar', {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setPedidos(response.data);
          } catch (error) {
              console.error('Erro ao carregar dados:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchUserData();
  }, []);





  // 📌 Logout
  const handleLogout = async () => {
      await AsyncStorage.clear();
      navigation.navigate('Login'); // Volta para a tela de login
  };

  return (
      <SafeAreaView style={styles.container}>
          {/* Header com imagem de perfil */}
          <View style={styles.profileHeader5}>
              <Image source={require('./assets/usuario.png')} style={styles.iconperfil}/>
              <Text style={styles.userName22}>{nome}</Text>
          </View>

          {/* Lista de Pedidos */}
          <ScrollView contentContainerStyle={styles.ordersContainer}>
              <Text style={styles.sectionTitle}>Histórico de Pedidos</Text>
              {loading ? (
                  <ActivityIndicator size="large" color="#6c63ff" />
              ) : pedidos.length === 0 ? (
                  <Text style={styles.noData}>Nenhum pedido encontrado</Text>
              ) : (
                  pedidos.map((pedido) => (
                      <View key={pedido._id} style={styles.pedidoContainer}>
                          <Text style={styles.pedidoText}>{pedido.descricao}</Text>
                      </View>
                  ))
              )}
          </ScrollView>

          {/* Botão de Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
      </SafeAreaView>
  );
};


const Boasvindas = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.screenHeader}>Bem-vindo(a) ao Skill Market Sapezal!</Text>
    <Text style={styles.description}>Por favor, escolha uma opção para continuar:</Text>
    <FlatList
      data={DATA}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image source={item.icon} style={styles.image} />
          <View style={styles.itemContent}>
            <Text style={styles.title} onPress={() => navigation.navigate(item.href)}>
              {item.title}
              
            </Text>
            <Text style={styles.description} onPress={() => navigation.navigate(item.href)}>{item.description}</Text>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
    <Text style={styles.footer}>Termos de Uso | Política de Privacidade</Text>
  </SafeAreaView>
);

const Profissional = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(''); // Adicionado campo de email
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [area, setArea] = useState('');

  const areasDisponiveis = [
    'Reparos, Construções e Serviços Gerais',
    'Tecnologia, Educação e Consultorias',
    'Imóveis, Veículos e Locações Gerais',
    'Saúde, Beleza e Bem-Estar',
  ];

  const handleCadastro = async () => {
    if (!nome || !email || !telefone || !senha || !confirmSenha || !area) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        nome,
        email, // Enviar email no cadastro
        telefone,
        senha,
        tipoUsuario: 'profissional',
        area
      });
      const { token } = response.data;
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      console.log('📌 Resposta do backend:', response.data);
      
      // Salvar informações no AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('nome', nome);
      await AsyncStorage.setItem('email', email); // Salvar email para lógica de recuperação
      await AsyncStorage.setItem('telefone', telefone);
      await AsyncStorage.setItem('tipoUsuario', 'profissional');
      await AsyncStorage.setItem('area', area);

      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Ocorreu um erro ao cadastrar.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.centered]}>
      <View style={styles.loginContainer}>
        <Image source={require('./assets/Logo_.png')} style={styles.categoryIconLogin} />
        <Text style={styles.loginHeader}>Cadastro de Profissional</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail" // Novo campo
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Número de telefone"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <Text style={styles.label}>Área de Atuação*</Text>
        <View style={styles.pickerContainer4}>
          <Picker
            selectedValue={area}
            onValueChange={(itemValue) => setArea(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma área" value="" />
            {areasDisponiveis.map((area, index) => (
              <Picker.Item key={index} label={area} value={area} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmSenha}
          onChangeText={setConfirmSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


function Inicio() {
  const [nome, setNome] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [searchText, setSearchText] = useState('');

  // 🔹 Capturar nome do profissional
  const fetchNome = async () => {
      try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
              console.error('Token não encontrado.');
              return;
          }

          const response = await api.get('/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data && response.data.nome) {
              setNome(response.data.nome);
          }
      } catch (error) {
          console.error('Erro ao buscar nome do usuário:', error.response?.data || error.message);
      }
  };

  // 🔹 Capturar localização do profissional
  const obterLocalizacao = async () => {
      try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              setErrorMsg('Permissão negada');
              return;
          }
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);
      } catch (error) {
          console.error("Erro ao obter localização:", error.message);
      }
  };

  // 🔹 Carregar pedidos enviando a localização do profissional
  const carregarPedidos = async () => {
      try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
              console.error('Token não encontrado.');
              return;
          }

          if (!location) {
              console.log("Localização ainda não carregada.");
              return;
          }

          const response = await api.get('/pedidos/listarAll', {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                  latitude: location.latitude,
                  longitude: location.longitude
              }
          });

          if (response.data) {
              setPedidos(response.data);
              console.log('Pedidos carregados:', response.data);
          }
      } catch (error) {
          console.error('Erro ao carregar pedidos:', error.response?.data || error.message);
      }
  };
  

  // 🔹 useEffect correto
  useEffect(() => {
      const fetchData = async () => {
          await fetchNome();
          await obterLocalizacao();
      };

      fetchData();
  }, []);

  useEffect(() => {
      if (location) {
          carregarPedidos();
      }
  }, [location]);

  const AbrirWhatsapp = (telefone) => {
    if (!telefone) {
      Alert.alert("Erro", "Número de telefone não disponível.");
      return;
    }
  
    if (typeof telefone !== "string") {
      console.error("Erro: telefone não é uma string", telefone);
      Alert.alert("Erro", "Número de telefone inválido.");
      return;
    }
  
    // Remover espaços e caracteres especiais do número
    const numeroFormatado = telefone.replace(/\D/g, "");
  
    // Criar URL do WhatsApp
    const url = `https://wa.me/55${numeroFormatado}`;
  
    // Abrir o link do WhatsApp
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    });
  };

  return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.footerheader}>Bem-vindo, {nome}!</Text>

          {/* Campo de Busca */}
          
          

          <FlatList
              data={pedidos}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                  <View style={styles.pedidoContainer}>
                  
                      <Text style={styles.nomeUsuario}>📌 por: {item.nomeUsuario}</Text>

                      <Text style={styles.description}>{item.descricao}</Text>
                      <View style={styles.descriptionItem}>
                          <Text style={styles.description}>💬📱 Contato:  {item.telefone} </Text>
                      </View>
                     
                      <Button title='Entrar em contato' onPress={() => AbrirWhatsapp(item.telefone)} />

                      <Text></Text>
                      <Text>🚗 Distância: {item.distancia}</Text> {/* Exibe a distância formatada */}
                      <Text style={styles.tempo}>publicado {item.tempoDecorrido}</Text>
                  </View>
              )}
              ListEmptyComponent={<Text style={styles.noPedidos}>Nenhum pedido encontrado.</Text>}
          />
      </SafeAreaView>
  );
}

function Login({ navigation }) {
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!telefone || !senha) {
        alert('Preencha todos os campos');
        return;
    }

    try {
        const response = await api.post('/auth/login', {
            telefone,
            senha
        });

        // Salvar token no AsyncStorage
        const token = response.data.token; // Pegando o token corretamente
        await AsyncStorage.setItem('token', token);
        console.log('Token do usuário: ' + token); // Agora mostrará o token corretamente

        await AsyncStorage.setItem('userId', String(response.data.userId)); // Convertendo para string por garantia
        await AsyncStorage.setItem('nome', response.data.nome);
        await AsyncStorage.setItem('tipoUsuario', response.data.tipoUsuario);

        alert('Login realizado com sucesso!');
        
        // Redirecionar o usuário conforme seu tipo
        if (response.data.tipoUsuario === 'profissional') {
            navigation.navigate('AppTabsProfissional');
        } else {
            navigation.navigate('App');
        }

    } catch (error) {
        console.error('Erro no login:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
    }
};

  return (
    <SafeAreaView style={[styles.container, styles.centered]}>
      <View style={styles.loginContainer}>
        <Image source={require('./assets/Logo_.png')} style={styles.categoryIconLogin} />
        <Text style={styles.loginHeader}>Faça Login!</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de telefone"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={(text) => setTelefone(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={(text) => setSenha(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar!</Text>
        </TouchableOpacity>

      
        <TouchableOpacity onPress={() => navigation.navigate("EsqueciSenha")}>
        <Text style={styles.footer}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => navigation.navigate('Boas-vindas')}>
        <Text style={styles.footer}>Não tenho Conta!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const EsqueciSenha = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleEnviarCodigo = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu e-mail.");
      return;
    }

    try {
      const response = await api.post("/auth/esqueci-senha", { email });
      Alert.alert("Sucesso", response.data.message);
      navigation.navigate("RedefinirSenha", { email });
    } catch (error) {
      console.error("Erro:", error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.message || "Falha ao enviar código.");
    }
  };

  return (
    <SafeAreaView style={styles.container30}>
      <View style={styles.formContainer30}>
        <Image source={require("./assets/lock.png")} style={styles.lockImage30} />
        <Text style={styles.header30}>Esqueceu sua senha?</Text>
        <Text style={styles.subtext30}>
          Digite seu e-mail cadastrado e enviaremos um código para redefinir sua senha.
        </Text>

        <TextInput
          style={styles.input30}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button30} onPress={handleEnviarCodigo}>
          <Text style={styles.buttonText30}>Enviar Código</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText30}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const RedefinirSenha = ({ route, navigation }) => {
  const { email } = route.params;
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const handleRedefinirSenha = async () => {
    if (!codigo || !novaSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/auth/redefinir-senha", { email, codigo, novaSenha });
      Alert.alert("Sucesso", response.data.message);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro:", error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.message || "Falha ao redefinir senha.");
    }
  };

  return (
    <SafeAreaView style={styles.container30}>
      <View style={styles.formContainer30}>
        <Image source={require("./assets/reset-password.png")} style={styles.lockImage30} />
        <Text style={styles.header30}>Redefinir Senha</Text>
        <Text style={styles.subtext30}>
          Digite o código recebido e sua nova senha para concluir a redefinição.
        </Text>

        <TextInput
          style={styles.input30}
          placeholder="Código de verificação"
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="number-pad"
        />

        <TextInput
          style={styles.input30}
          placeholder="Nova senha"
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />

        <TouchableOpacity style={styles.button30} onPress={handleRedefinirSenha}>
          <Text style={styles.buttonText30}>Redefinir Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton30}>
          <Text style={styles.backButtonText30}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/*
function Oportunidades() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado.');
          return;
        }

        const response = await api.get('/pedidos/listarPorCategory', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setPedidos(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error.response?.data || error.message);
      }
    };

    carregarPedidos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.pedidoContainer}>
            <Text style={styles.nomeUsuario}>📌 por: {item.nomeUsuario}</Text>
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.description}>{item.descricao}</Text>

            <View style={styles.descriptionItem}>
              <Text style={styles.description}>📞 {item.telefone}</Text>
              <Text style={styles.description}>📍 {item.localizacao}</Text>
            </View>
            <Button 
          title='Aceitar Serviço'
          />
          <Text></Text>
            <Text style={styles.tempo}>{item.tempoDecorrido}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noPedidos}>Nenhum pedido encontrado.</Text>}
      />
    </SafeAreaView>
  );
}
*/
function Publicar() {
  const [videoUri, setVideoUri] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controle do carregamento
  const cameraRef = useRef(null);
  const [capturado, setCapturado] = useState(false);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    setCapturado(true);

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const uploadVideo = async () => {
    if (!videoUri) {
      Alert.alert("Erro", "Nenhum vídeo selecionado!");
      return;
    }

    setLoading(true); // Ativar carregamento

    try {
      // Obter localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada!");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const formData = new FormData();
      formData.append("video", {
        uri: videoUri,
        type: "video/mp4",
        name: "video.mp4",
      });

      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Erro", "Usuário não autenticado.");
        setLoading(false);
        return;
      }

      formData.append("usuario", userId);

      const response = await api.post("/videos/PostarVideo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", "Vídeo postado com sucesso!");
        setVideoUri(null);
      } else {
        console.error("Erro da API:", response.data);
        Alert.alert("Erro", response.data?.message || "Falha ao enviar o vídeo.");
      }
    } catch (error) {
      console.error("Erro ao enviar vídeo:", error.response?.data || error.message);
      Alert.alert("Erro", "Erro ao enviar o vídeo.");
    } finally {
      setLoading(false); // Desativar carregamento
    }
  };

  return (
    <ImageBackground
      source={require("./assets/background2.png")}
      style={styles.background8}
    >
      <View style={styles.overlay8}>
        <Text style={styles.title8}>
          Grave vídeos curtos de 30 segundos mostrando seu serviço!
        </Text>

        <TouchableOpacity style={styles.button8} onPress={pickVideo} disabled={loading}>
          <Text style={styles.buttonText8}>Escolher da Galeria</Text>
        </TouchableOpacity>

        {videoUri && (
          <>
            <Video source={{ uri: videoUri }} style={{ width: 300, height: 200, marginTop: 10 }} controls />

            <TouchableOpacity
              style={styles.buttontext10}
              onPress={uploadVideo}
              disabled={loading} // Desativa o botão enquanto estiver carregando
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText4}>Publicar Vídeo</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const PerfilProfissional = () => {
  const navigate = useNavigation()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('');
 

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const storedNome = await AsyncStorage.getItem('nome');
              const storedTelefone = await AsyncStorage.getItem('telefone');
              const token = await AsyncStorage.getItem('token');

              if (storedNome) setNome(storedNome);
              if (storedTelefone) setTelefone(storedTelefone);

          } catch (error) {
              console.error('Erro ao carregar dados:', error);
          } finally {
              console.log('Finally');
          }
      };

      fetchUserData();
  }, []);





  // 📌 Logout
  const handleLogout = async () => {
      await AsyncStorage.clear();
      navigation.navigate('Login'); // Volta para a tela de login
  };

  return (
      <SafeAreaView style={styles.container}>
          {/* Header com imagem de perfil */}
          <View style={styles.profileHeader5}>
              <Image source={require('./assets/comerciante.png')} style={styles.iconperfil}/>
              <Text style={styles.userName22}>{nome}</Text>
          </View>
          <View style={styles.headerText10}>
            <Text style={styles.loginHeader}>⚠️ Avisos ⚠️</Text>
      <Text style={styles.buttonText2}>1. Alavanque seus negocios, A skill market foi projetada para aprimorar seus negócios!</Text>
      <Text style={styles.buttonText2}>2. Estamos em constante desenvolvimento, a cada dia aprimoramos um pouco para melhor usabilidade.</Text>
          </View>


          {/* Botão de Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
      </SafeAreaView>
  );
};



function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6c63ff',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 5 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Escolha os ícones com base no nome da rota
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Explorar") {
            iconName = "play-circle";
          } 
          else if (route.name === "Pedidos") {
            iconName = "assignment";
          } else if (route.name === "Perfil") {
            iconName = "person";
          }

          // Retorne o ícone usando react-native-vector-icons
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explorar" component={Explorar} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

function UploadButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <Icon name="cloud-upload" size={30} color="#fff" />
    </TouchableOpacity>
  );
}
function AppTabsProfissional() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6c63ff',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 5 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Escolha os ícones com base no nome da rota
          if (route.name === "Inicio") {
            iconName = "work";
    
          } else if (route.name === "Perfil") {
            iconName = "person";
          }
          else if (route.name === "Publicar") {
          iconName = "live-tv";
        }

          // Retorne o ícone usando react-native-vector-icons
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Inicio} />
      
      <Tab.Screen name="Publicar" component={Publicar} />
      <Tab.Screen name="Perfil" component={PerfilProfissional} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const pingServer = () => {
      fetch("https://backend-skillmarket.onrender.com/")
        .then(() => console.log("Servidor pingado!"))
        .catch((err) => console.error("Erro ao pingar:", err));
    };

    const interval = setInterval(pingServer, 300000); // A cada 5 minutos

    return () => clearInterval(interval); // Cleanup quando o app fechar
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Boas-vindas" component={Boasvindas} />
        <Stack.Screen name="Profissional" component={Profissional} />
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Explorar" component={Explorar} />
        <Stack.Screen name="FormularioPedidos" component={FormularioPedidos} />
        <Stack.Screen name="AppTabsProfissional" component={AppTabsProfissional} />
        <Stack.Screen name="Delivery" component={Delivery} />
        <Stack.Screen name="Cliente" component={Cliente} />
        <Stack.Screen name="App" component={AppTabs} />
        <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
        <Stack.Screen name="Prepararpedido" component={Prepararpedido} />
      </Stack.Navigator>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
    </NavigationContainer>
  );
}


  
// Estilos
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f9f9f9',
    padding: 30,
  },
  container34: {
    flex: 1,
    backgroundColor: "black",
  },
  videoContainer34: {
    height: height,
    width: width,
    position: "relative",
  },
  video34: {
    height: height,
    width: width,
  },
  overlay34: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  infoContainer34: {
    position: "absolute",
    bottom: 100,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer34: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage34: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username34: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionsContainer34: {
    position: "absolute",
    bottom: 100,
    right: 20,
    alignItems: "center",
  },
  actionButton34: {
    alignItems: "center",
    marginBottom: 20,
  },
  actionText34: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
    fontFamily:'roboto'
  },
  userPhone22:{
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop:30,
    fontFamily:'roboto',
    marginBottom:10,
  },
  clearText:{
  width:30,
  height:40,
  fontSize:20
  },
  container30: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer30: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  lockImage30: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  header30: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily:'roboto'
  },
  subtext30: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily:'roboto'
  },
  input30: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button30: {
    backgroundColor: '#6c63ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText30: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'roboto'
  },
  backButton30: {
    marginTop: 10,
  },
  backButtonText30: {
    fontSize: 14,
    color: '#6c63ff',
    fontFamily:'roboto'
  },
  profileHeader:{

  },
  container22: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer22: {
    width: "100%",
    height: height,
    justifyContent: "flex-end",
    position: "relative",
  }, 
  video22: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay22: {
    position: "absolute",
    width: "100%",
    height: "40%",
    bottom: 0,
  },
  infoContainer22: {
    position: "absolute",
    bottom: 80,
    left: 20,
  },
  profileContainer22: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage22: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName22: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
    marginTop:30,
    fontFamily:'roboto',
    marginBottom:1,
  },
  description22: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 4,
    width: width * 0.7,
  },
  actionsContainer: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  actionButton: {
    marginBottom: 20,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
    fontFamily:'roboto',
    
  },
  container9: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header9: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText9: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily:'roboto'
  },
  profileContainer9: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage9: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileName9: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    fontFamily:'roboto'
  },
  profileUsername9: {
    fontSize: 14,
    color: "#757575",
    fontFamily:'roboto'
  },
  buttonContainer9: {
    flexDirection: "row",
    marginTop: 12,
  },
  editButton9: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  contactButton9: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText9: {
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily:'roboto'
  },
  buttonTextBlack9: {
    color: "#000000",
    fontWeight: "bold",
    fontFamily:'roboto'
  },
  sectionTitle9: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 20,
  },
  videoContainer9: {
    width: "50%",
    padding: 8,
  },
  videoThumbnail9: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
  videoTitle9: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
  background8: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay8: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  title8: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  button8: {
    backgroundColor: '#ff9900',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText8: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'roboto'
  },
  buttontext10:{
    color: 'white',
    fontSize: 16,
    fontFamily: 'roboto',
    backgroundColor: 'blue',
    marginTop:'10',
    borderRadius:10,
    padding:'10',
    alignContent:'center',
    alignItems:'center'
  },
  video8: {
    width: 300,
    height: 200,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    left:270,
    width:'50',
    
},
  pedidoContainer5: {
    backgroundColor: '#fff', // Fundo branco para destacar os pedidos
    padding: 15,
    marginVertical: 10, // Espaçamento entre os pedidos
    marginHorizontal: 20, // Margens laterais
    borderRadius: 10, // Cantos arredondados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Efeito de sombra no Android
},
title5: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Cinza escuro para o título
    marginBottom: 5,
},
description5: {
    fontSize: 16,
    color: '#666', // Cinza médio para descrição
    marginBottom: 8,
},
descriptionItem5: {
    flexDirection: 'row', // Exibir telefone e localização na mesma linha
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Fundo sutil para destaque
    padding: 10,
    borderRadius: 8,
},
tempo5: {
    fontSize: 14,
    color: '#999', // Cinza claro para menor destaque
    fontStyle: 'italic',
    marginTop: 10,
},
  backButton5:{
    margin: 16,
  },
  profileHeader5: {
    alignItems: 'center',
    marginBottom: 20,
},
  container5:{
      flex: 1,
      backgroundColor: '#f9f9f9',
      padding: 20,
  },
  pickerWrapper4: {
    
    marginLeft: 10,
  },
  pickerText4: {
    fontSize: 16,
    color: "#333",
  },
  picker4: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
    width: "100%",
  },
  button4: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText4: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily:'roboto'
  },
  input4: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  inputContainer4: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: "100%",
    marginBottom: 15,
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButton:{
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#222',
    marginHorizontal: 5,
    
  },
  categoryButtonSelected: {
    backgroundColor: "#6c63ff",
  }, 
  categoryTextSelected: {
    backgroundColor: '#6c63ff',
  },
  categoryText2: {
    color: '#aaa',
    fontSize: 16,
  },
  categoryText3: {
    color: '#aaa',
    fontSize: 20,
    fontWeight:30,
    fontFamily:'roboto',

  },
  categoryContainer:{
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  profileImage:{
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileImage5:{
      width: 100,
      height: 100,
      borderRadius: 50,
  },
  editPhotoButton: {
    marginTop: 8,
    backgroundColor: '#6c63ff',
    padding: 5,
    borderRadius: 50,
},
input5: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 16,
  backgroundColor: '#fff',
},
  container3:{
    flex: 1,
    backgroundColor: '#000',
  },
  registerContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
},
header: {
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 20,
},
headerText10:{
backgroundColor:'#fff',
bottom:'-20',
marginBottom:150,
},
  header2: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    padding: 8,
    borderRadius: 8,
  },
  filterText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay:{
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  profileContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionalName:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  pickerContainer: {
    backgroundColor: "#222", // Fundo escuro do seletor
    color: "#fff", // Texto branco no seletor
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pickercontainer4:{
    flex:1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: "100%",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 80,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12, // Padding vertical para altura consistente
    paddingHorizontal: 20, // Padding horizontal para largura do botão
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    margin: '5%',
    borderRadius: 8,
},
saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o texto dentro do botão
},

  container2:{
    backgroundColor: '#f9f9f9',
    flex:1
  },
  backButton: {
      margin: 16,
    },
  
  containerGrow:{
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  containerPedido:{
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerpedir:{
  flexDirection: 'row',
  width:'60%',
  justifyContent: 'space-between'
  
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image2:{
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    fontFamily: 'roboto'
  },
  description2: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    color: '#555',
  },
  formContainer2: {
    padding: 16,
  },
  imageContainer2: {
      alignItems: 'center',
      marginTop: 24,
    },
  imagePedir:{
    width: 130,
    height: 130,

  },
  imagePedir2:{
    width:150,
    height:110,
  },

  iniciarsolic: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4CAF50',
    textAlign: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 40,
    marginHorizontal: 50,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Fundo suave para o container principal
    padding: 16, // Espaçamento interno
  },
  categoryBox: {
    marginBottom: 24, // Espaçamento entre as categorias
    padding: 12, // Espaçamento interno no box da categoria
    borderRadius: 10, // Bordas arredondadas para um visual moderno
    backgroundColor: '#ffffff', // Fundo branco para destaque
    shadowColor: '#000', // Sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Sombra para Android
  },
  categoryHeader2:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryHeader: {
    fontSize: 22, // Tamanho maior para o título
    fontWeight: 'bold', // Texto em negrito para destaque
    color: '#222', // Cor escura para contraste
    marginBottom: 10, // Espaço abaixo do título
  },
  serviceCard: {
    marginRight: 16, // Espaçamento lateral entre serviços
    alignItems: 'center', // Centraliza os itens horizontalmente
    backgroundColor: '#fafafa', // Fundo leve para cada cartão
    padding: 12, // Preenchimento interno no cartão do serviço
    borderRadius: 8, // Bordas arredondadas
    shadowColor: '#000', // Sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2, // Sombra para Android
  },
  icon:{
    marginRight: 15,
  },
  serviceIcon: {
    width: 90, // Largura da imagem
    height: 90, // Altura da imagem
    borderRadius: 45, // Deixa a imagem circular
    marginBottom: 8, // Espaço entre a imagem e o texto
  },
  label:{
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
    label2: {
      fontSize: 14,
      marginBottom: 4,
      color: '#333',
    },
 
  serviceLabel: {
    fontSize: 16, // Tamanho do texto do serviço
    fontWeight: '500', // Peso intermediário para boa visibilidade
    color: '#555', // Cor suave para o texto
    textAlign: 'center', // Centraliza o texto
    fontFamily: 'roboto'
  },
  gradientHeader: {
    padding: 20,
    borderRadius: 10,
  },  
  criarpedido: {
    bottom: 50
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'roboto'
  },
    buttonText2: {
    color: 'grey',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'roboto',
    marginBottom: 50,
  },
  buttonTextPedir:{
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  loginContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  registerContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:20,
    bottom: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  input2:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  createOrderButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  createOrderContainer:{
    width: '70%',
  
    justifyContent:'center',
    textAlign: 'center',
    left: '15%',
    marginBottom: 20,
  },
  createOrderButtonText: {
    fontFamily: 'roboto',
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    textAlign:'center',
    marginTop:20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  category: {
    alignItems: 'center',
    marginBottom: 16,
    width: '23%',
  },
  category2:{
    fontSize: 16,
    color: "#ccc",
  },
  actionsContainer: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  actionButton: {
    marginBottom: 20,
    alignItems: "center",
  },
  actionIcon: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  categoryIconLogin:{
    width: 80,
    height: 80,
    left: 110,
    marginBottom: 8,
    alignItems: 'center'
  },
  categoryText2: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'roboto'
  },
  service: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#666',
    alignSelf: 'center',
  },  
  serviceImage: {
    width: 100,
    height: 100,
  },
  serviceContent: {
    flex: 1,
    padding: 13,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily:'roboto'
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
    fontFamily:'roboto'
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c63ff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pedidoContainer2:{
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Para sombras no Android
    flexDirection: 'column',
  
  },
 
  title4: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  pedidoContainer3: {
    backgroundColor: '#FFD70022', // Dourado suave com transparência
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#DAA520', // Um tom de dourado escuro para sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Aumenta o efeito de sombra no Android
    flexDirection: 'column',
    borderWidth: 1, // Borda fina para destacar o dourado
    borderColor: '#FFD700', // Borda dourada clara
},
  pedidoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Para sombra no Android
    flexDirection: 'column',
  },
  pedidoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  pedidoTitle2:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  pedidoDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  noPedidos: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: '#6c63ff', // Cor de destaque para o botão
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  screenHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Texto mais escuro para maior contraste
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  inputPedir:{
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex:1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  descriptionItem: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  
  footer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  footerheader:{
    fontSize: 16,
    color: 'black',//#888
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 40,
    paddingBottom: 15,
  },
  footerheaderPedidos:{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  footerheaderPedidos2:{
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
    width:300,
    marginTop:10,
    justifyContent:'center',
    fontFamily: 'roboto'
  },
  descriptionItem2: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    
  },
  reelContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  reelImage: {
    width: 300,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 50, // Defina uma largura fixa
    height: 50, // Defina uma altura fixa
    resizeMode: 'contain', // Garante que a proporção seja mantida
    marginRight: 10, //
  },  
  imageBack2:{
    width: 54,
    height: 54,
  },
  imageBack3:{
    width: 64,
    height: 64,
    left:100,
    bottom:-100,
    
  },
  imageBack4:{
    width: 64,
    height: 64,
   left:'25%',
   bottom:'-30%'
    
  },
  iconperfil:{
    width: 100,
    height: 100,
    bottom:'-20%',
    marginBottom:50,
    
    
  },
  alinhar:{
  flexDirection:'row',
  alignContent:'center'
  },
  imageBack:{
    width: 50, // Defina uma largura fixa
    height: 50, // Defina uma altura fixa
    resizeMode: 'contain', // Garante que a proporção seja mantida
    marginLeft: 20, //
    marginTop:10
  },
  buttonPedir:{
    backgroundColor: '#6c63ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#6c63ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },

});