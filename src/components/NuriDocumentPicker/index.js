import React, { useState } from 'react';
import moment from 'moment';
import { ActivityIndicator, Text, TouchableOpacity, View , useColorScheme} from 'react-native';
import DocumentPicker, { 
  isInProgress,
 } from 'react-native-document-picker';

import Colors from '../../assets/colors';
import { CloseButton, DocumentImage, FileImage, UploadImage } from '../../assets/images/SvgImages';
import styles from './styles';

const NuriDocumentPicker = (): React.FC => {

  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState({});

  const handleError = (err) => {
    if (DocumentPicker.isCancel(err)) {
      setLoading(false);
      console.log('error_isCancel: ',err)
    } else if (isInProgress(err)) {
      setLoading(false);
      console.log('error_inProgress: ',err)
    } else {
      throw err;
      console.log('err: ',err)
    }
  };

  const handlePress = async () => {
    setLoading(true);
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
        allowMultiSelection: false,
      });
      setLoading(false);
      console.log('res: ',res)
      setDocument(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        handleError(err);
      } else {
        throw err;
      }
    }
  };

  const handleDeletePress = () => {
    setDocument({})
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingVertical: 35,
          },
        ]}>
        <ActivityIndicator color={Colors.primary} size='large' />
      </View>
    );
  }
  return (
    <View style={[styles.container, { borderStyle: document?.name ? 'solid' : 'dashed' }]}>
      {document ? (
        <TouchableOpacity onPress={() => {handlePress()}} style={{ paddingVertical: 8 }}>
          <UploadImage width={45} margin={14} />
          <Text>
            <Text style={styles.buttonTextBlue}>Browse</Text> <Text style={styles.buttonText}>your files</Text>
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: '100%', paddingHorizontal: 16 }}>
          <View style={styles.titleContainer}>
            <DocumentImage />
            <Text style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark }]}>Documents</Text>
          </View>
          <View style={styles.documentResult}>
            <View style={[styles.documentDetails, { backgroundColor: isDarkMode ? Colors.extraDark : '#F4F5F8' }]}>
              <FileImage />
              <View
                style={{
                  maxWidth: '60%',
                  marginRight: 32,
                }}>
                <Text numberOfLines={1} style={[styles.docTitle, { color: isDarkMode ? Colors.light : Colors.dark }]}>
                  {document?.name}
                </Text>
                <Text style={[styles.date, { color: isDarkMode ? Colors.light : Colors.dark }]}>
                  Uploaded {moment(document?.createdAt).format('MMMM Do YYYY, hh:mm a')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDeletePress()}>
                <CloseButton width={15} fill={isDarkMode ? Colors.light : '#252525'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default NuriDocumentPicker;
