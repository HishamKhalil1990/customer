import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker'
import Loader from "../Components/Loader";
import * as api from "../api/api";

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [branchOpen, setBranchOpen] = useState(false);
  const [branchValue, setBranchValue] = useState(null);
  const [branch, setBranch] = useState([]);

  const fetchBranches = async() => {
    if(errortext != ''){
      setErrortext('')
    }
    setLoading(true)
    const data = await api.getBranches()
    if(data){
      setLoading(false)
      if (data.status == "success") {
        branchesList(data.data.branches)
      }else{
        setErrortext(data.msg)
      }
    }else{
      setLoading(false)
      setErrortext('لم يتم تحديث قائمة الفروع')
    }
  }

  const goToInfoScreen = () => {
    if(branchValue){
      navigation.navigate('Info',{branch:branchValue})
    }else{
      alert('الرجاء اختيار فرع')
    }
  }

  useEffect(() => {
    fetchBranches()
  }, []);

  const branchesList = (fetchedBranches) => {
    const branches = fetchedBranches.map((branch,index) => {
      return {
        key:index, 
        label:branch,
        value: branch,
      }
    })
    setBranch([...branches])
  }

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <View
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
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
            <View style={[styles.SectionStyle,{zIndex:10,marginBottom:25}]}>
              <DropDownPicker
                dropDownContainerStyle={{color: "#790252",borderColor: "#790252",}}
                style={{color: "#790252",borderColor: "#790252",}}
                searchTextInputStyle={{color: "#790252",borderColor: "#790252",}}
                selectedItemContainerStyle={{color: "#790252",borderColor: "#790252",}}
                selectedItemLabelStyle={{color: "#790252",borderColor: "#790252",}}
                badgeStyle={{color: "#790252",borderColor: "#790252",}}
                textStyle={{color: "#790252"}}
                itemKey="key"
                searchable={true}
                open={branchOpen}
                value={branchValue}
                items={branch}
                setOpen={setBranchOpen}
                setValue={setBranchValue}
                setItems={setBranch}
                placeholder="اختر الفرع"
                containerStyle={{height: 50,borderColor: "#dadae8"}}
                autoScroll={true}
                listMode="FLATLIST"
                zIndex={3000}
              />
            </View>
            {errortext != "" ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={goToInfoScreen}
            >
              <Text style={styles.buttonTextStyle}>START</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={fetchBranches}
            >
              محاولة جديد ؟
            </Text>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
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
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    color: "#790252",
    borderColor: "#dadae8",
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
});
