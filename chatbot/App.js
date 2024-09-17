import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [generating, setGenerating] = useState(false); // Yeni state

  const handleSend = async () => {
    if (!prompt.trim()) return; // Boş mesaj gönderimini engelle

    const userMessage = { text: prompt, type: 'user' };
    setMessages([...messages, userMessage]);
    setGenerating(true); // Mesaj gönderirken generating state'ini true yap
    setPrompt(''); // Mesajı gönderildikten sonra temizle
    try {
      const res = await fetch('http://10.0.2.2:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false,
        }),
      });

      const data = await res.json();
      const botMessage = { text: data.response, type: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      const errorMessage = { text: 'Error: Could not connect to the server', type: 'bot' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      
      setGenerating(false); // Yanıt geldikten sonra generating state'ini false yap
      
    }

   
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView
          contentContainerStyle={styles.chatContent}
          ref={(ref) => ref?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.type === 'user' ? styles.userMessage : styles.botMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
          {generating && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>Generating...</Text>
            </View>
          )}
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={prompt}
          onChangeText={setPrompt}
        />

        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    width: '90%',
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
    flexDirection: 'column',
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    color: '#fff',
  },
  botMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
    color: '#fff',
  },
  messageText: {
    fontSize: 14,
  },
});

export default App;


//Mesajları komple prompt şeklinde yollayan uygulama
/*
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [generating, setGenerating] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return; // Boş mesaj gönderimini engelle

    const userMessage = { text: prompt, type: 'user' };
    const allMessages = [...messages, userMessage]; // Eski mesajlar + yeni mesaj
    setMessages(allMessages);
    setGenerating(true);

    try {
      const res = await fetch('http://10.0.2.2:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: allMessages.map(msg => msg.text).join('\n'), // Mesajları birleştir
          stream: true, // Stream olarak gönder
        }),
      });

      const data = await res.json();
      const botMessage = { text: data.response, type: 'bot' };
      setMessages([...allMessages, botMessage]);
    } catch (error) {
      const errorMessage = { text: 'Error: Could not connect to the server', type: 'bot' };
      setMessages([...allMessages, errorMessage]);
    } finally {
      setGenerating(false);
    }

    setPrompt('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView
          contentContainerStyle={styles.chatContent}
          ref={(ref) => ref?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.type === 'user' ? styles.userMessage : styles.botMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
          {generating && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>Generating...</Text>
            </View>
          )}
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={prompt}
          onChangeText={setPrompt}
        />

        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    width: '90%',
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
    flexDirection: 'column',
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    color: '#fff',
  },
  botMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
    color: '#000',
  },
  messageText: {
    fontSize: 16,
  },
});

export default App;







*/
