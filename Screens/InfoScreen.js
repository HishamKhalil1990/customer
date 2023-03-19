import { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'; 
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker'
import * as api from "../api/api";
import Loader from "../Components/Loader";
import Svg, { Path } from "react-native-svg"

const InfoScreen = ({ navigation, route }) => {
  const [branch, setBranch] = useState(route.params.branch)
  const [userName, setUserName] = useState(null);
  const [phoneNo, setPhoneNo] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState(null);
  const [serviceLevelOpen, setServiceLevelOpen] = useState(false);
  const [serviceLevelValue, setServiceLevelValue] = useState(null);
  const [serviceLevel, setServiceLevel] = useState([
    {
      key:'1',
      label:'راضي',
      value:'راضي'
    },
    {
      key:'2',
      label:'غير راضي',
      value:'غير راضي'
    }
  ]);

  const passwordInputRef = createRef();

  useEffect(() => {
    activateKeepAwakeAsync()
    return () => {
      deactivateKeepAwake()
    }
  })

  const clear = () => {
    setServiceLevelOpen(false)
    setServiceLevelValue(null)
    setUserName(null)
    setPhoneNo(null)
    setErrortext(null)
  }

  const handleSubmitPress = async() => {
    setErrortext(null);
    if (!phoneNo) {
      alert("حقل الهاتف اجباري");
    }else{
      const arr = phoneNo.split('')
      if(arr.length == 10 && (arr[0] == '0') && (arr[1] == '7') && ((arr[2] == '9') || (arr[2] == '8') || (arr[2] == '7'))){
        setLoading(true)
        const data = await api.sendCustomerInfo(userName, phoneNo, branch, serviceLevelValue)
        setLoading(false)
        if(data){
          if (data.status == "success") {
            clear()
          }else{
            setErrortext(data.msg)
          }
          setVisible(true)
          setTimeout(() => {
            setVisible(false)
          },2000)
        }else{
          setVisible(true)
          setTimeout(() => {
            setVisible(false)
          })
        }
      }else{
        alert('الرجاء التاكد من رقم الهاتف')
      }
    }
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <Modal
          isVisible={visible}
          backdropOpacity={0.5}
          animationIn={'zoomInDown'}
          animationOut={'zoomOutUp'}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
      >
        <View style={styles.modalContent} >
          {errortext?
            <Text style={{color:"#790252",fontSize:25}}>
              الرجاء المحاولة مرة اخرى
            </Text>
          :
            <Image
              source={require("../assets/success.png")}
              style={{
                height: 70,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          }
        </View>
      </Modal>
      <KeyboardAvoidingView 
        enabled
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/logo-alrayhan.png")}
            style={{
              width: "50%",
              height: 100,
              resizeMode: "contain",
              margin: 30,
            }}
          />
        </View>
        <View style={styles.labelStyle}>
          <Text style={{width:'100%',paddingRight:10,color: "#790252",fontSize:15}}>
            الاسم
          </Text>
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            value={userName}
            onChangeText={(UserName) => setUserName(UserName)}
            placeholder="ادخل الاسم - حقل اختياري -"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() =>
              passwordInputRef.current && passwordInputRef.current.focus()
            }
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.labelStyle}>
          <Text style={{width:'100%',paddingRight:10,color: "#790252",fontSize:15}}>
            رقم الهاتف
          </Text>
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            value={phoneNo}
            onChangeText={(phoneNo) => setPhoneNo(phoneNo)}
            placeholder="ادخل رقم الهاتف"
            placeholderTextColor="#8b9cb5"
            keyboardType='phone-pad'
            ref={passwordInputRef}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
            underlineColorAndroid="#f000"
            returnKeyType="next"
          />
        </View>
        {/* <View style={styles.labelStyle}>
          <Text style={{width:'100%',paddingRight:10,color: "#790252",fontSize:15}}>
            مستوى الخدمة
          </Text>
        </View>
        <View style={[styles.SectionStyle,{zIndex:10}]}>
          <DropDownPicker
              dropDownContainerStyle={[styles.inputStyle2,{color: "#790252",borderColor: "#790252"}]}
              style={[styles.inputStyle2,{color: "#790252",borderColor: "#790252"}]}
              textStyle={{color: "#790252",fontSize:15,paddingRight:5}}
              placeholderStyle={{color:"#8b9cb5"}}
              itemKey="key"
              open={serviceLevelOpen}
              value={serviceLevelValue}
              items={serviceLevel}
              setOpen={setServiceLevelOpen}
              setValue={setServiceLevelValue}
              setItems={setServiceLevel}
              placeholder="اختر مستوى الخدمة - حقل اختياري -"
              autoScroll={true}
              listMode="FLATLIST"
              zIndex={3000}
            />
        </View> */}
        <View style={styles.SectionStyle2}>
          {serviceLevelValue?
            <>
              {serviceLevelValue == 'راضي'?
                <TouchableOpacity
                  onPress={() => setServiceLevelValue('راضي')}
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={80}
                    height={80}
                    viewBox="0 0 24 24"
                    fill="green"
                  >
                    <Path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.5 8a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm3.501 10C9.2 18 7.127 16.154 6 14.434l.493-.493c1.512 1.195 3.174 1.931 5.508 1.931 2.333 0 3.994-.736 5.506-1.931l.493.493C16.873 16.154 14.801 18 12.001 18z" />
                  </Svg>
                </TouchableOpacity>
              :
                <TouchableOpacity
                  onPress={() => setServiceLevelValue('راضي')}
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={80}
                    height={80}
                    viewBox="0 0 24 24"
                    fill="green"
                  >
                    <Path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931L6 14.434C7.127 16.154 9.2 18 12.001 18c2.8 0 4.872-1.846 5.999-3.566l-.493-.493zM8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </Svg>
                </TouchableOpacity>
              }
              {serviceLevelValue == 'غير راضي'?
                <TouchableOpacity
                  onPress={() => setServiceLevelValue('غير راضي')}
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={80}
                    height={80}
                    viewBox="0 0 24 24"
                    fill="red"
                  >
                    <Path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.5 8a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm8.122 9.377c-1.286-.819-2.732-1.308-4.622-1.308s-3.336.489-4.622 1.308l-.471-.58C7.855 15.636 9.668 14 12 14s4.145 1.636 5.093 2.797l-.471.58z" />
                  </Svg>
                </TouchableOpacity>
              :
                <TouchableOpacity
                  onPress={() => setServiceLevelValue('غير راضي')}
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={80}
                    height={80}
                    viewBox="0 0 24 24"
                    fill="red"
                  >
                    <Path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.001 14c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58C16.146 15.636 14.333 14 12.001 14zM8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </Svg>
                </TouchableOpacity>
              }
            </>
          :
            <>
              <TouchableOpacity
                onPress={() => setServiceLevelValue('راضي')}
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={80}
                  height={80}
                  viewBox="0 0 24 24"
                  fill="green"
                >
                  <Path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931L6 14.434C7.127 16.154 9.2 18 12.001 18c2.8 0 4.872-1.846 5.999-3.566l-.493-.493zM8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setServiceLevelValue('غير راضي')}
              >
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={80}
                  height={80}
                  viewBox="0 0 24 24"
                  fill="red"
                >
                  <Path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.001 14c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58C16.146 15.636 14.333 14 12.001 14zM8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                </Svg>
              </TouchableOpacity>
            </>
          }
        </View>
        {errortext != "" ? (
          <Text style={styles.errorTextStyle}>{errortext}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmitPress}
        >
          <Text style={styles.buttonTextStyle}>SEND</Text>
        </TouchableOpacity>
        <Text
          style={styles.registerTextStyle}
          onPress={clear}
        >
          محاولة جديد ؟
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
};
export default InfoScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginBottom: 40,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  labelStyle: {
    flexDirection: "row",
    // marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    // margin: 10,
  },
  SectionStyle2: {
    flexDirection: "row",
    justifyContent:'space-around',
    // marginBottom: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#790252",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#790252",
    height: 50,
    justifyContent:'center',
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    height:55,
    color: "#790252",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    fontSize:15,
    borderColor: "#790252",
    textAlign:'right'
  },
  inputStyle2: {
    flex: 1,
    color: "#790252",
    borderWidth: 1,
    borderRadius: 30,
    fontSize:15,
    borderColor: "#790252",
    textAlign:'right'
  },
  registerTextStyle: {
    color: "#790252",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
