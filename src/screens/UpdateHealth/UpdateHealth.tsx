import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import UpdateComponent from "./components/UpdateComponent";
import { LinearGradient } from "expo-linear-gradient";
import SymptomsPopup from "./components/SymptomsPopup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { stackScreens } from "../../Navigation/RootNavigation";
// import { stackScreens as stackScreens2 }  from "../../Navigation/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

type propsType = NativeStackScreenProps<stackScreens, "updateHealth">;

const UpdateHealth = (props: propsType) => {
  const { navigation } = props;

  const [isModalVisible, setModalVisible] = useState(false);
  const [dayCount, setDayCount] = useState(1); // Example day count
  const [symptoms, setSymptoms] = useState("");
  const [symptomsData, setSymptomsData] = useState<
    Record<string, string | null>
  >({});

  const handleUpdateSymptoms = () => {
    setModalVisible(true);
  };

  // const handleSaveSymptoms = () => {
  //   setSymptomsData((prevData) => ({
  //     ...prevData,
  //     [`day${dayCount}`]: prevData[`day${dayCount}`]
  //       ? `${prevData[`day${dayCount}`]}\n${symptoms}` // Append new symptoms
  //       : symptoms, // Add as new if no existing data
  //   }));
  //   console.log(`Symptoms for Day ${dayCount}: ${symptoms}`);
  //   // console.log("Updated Symptoms Data:", symptomsData);
  //   setModalVisible(false);
  //   setSymptoms(""); // Clear input
  // };

  // Function to get the current date in `dd-mm-yyyy` format
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /**
  const handleSaveSymptoms = () => {
    const currentDate = getCurrentDate(); // Get the current date

    setSymptomsData((prevData) => ({
      ...prevData,
      [currentDate]: prevData[currentDate]
        ? `${prevData[currentDate]}. ${symptoms}` // Append new symptoms if already present
        : symptoms, // Add as new if no existing data
    }));

    console.log(`Symptoms for ${currentDate}: ${symptoms}`);
    // console.log("Updated Symptoms Data:", symptomsData);

    setModalVisible(false);
    setSymptoms(""); // Clear input
  };
 */

  const handleSaveSymptoms = async () => {
    const currentDate = getCurrentDate(); // Get the current date

    try {
      // Fetch existing data from AsyncStorage for the current date
      const existingData = await AsyncStorage.getItem(
        `symptoms-${currentDate}`
      );
      let updatedSymptoms = symptoms;

      // If data exists, append the new symptoms
      if (existingData) {
        updatedSymptoms = `${existingData}. ${symptoms}`;
      }

      // Store the updated symptoms in AsyncStorage
      await AsyncStorage.setItem(`symptoms-${currentDate}`, updatedSymptoms);

      // Update local state for UI purposes
      setSymptomsData((prevData) => ({
        ...prevData,
        [currentDate]: updatedSymptoms,
      }));

      console.log(`Symptoms for ${currentDate}: ${updatedSymptoms}`);
    } catch (error) {
      console.error("Error saving symptoms:", error);
    }

    // Close the modal and clear the symptoms input field
    setModalVisible(false);
    setSymptoms(""); // Clear input
  };

  // Retrieve all data (for display or debugging purposes)
  useEffect(() => {
    const fetchAllSymptoms = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log("keys ", keys);
        const entries = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(entries);
        const dd = JSON.stringify(data, null, 2);
        console.log("All Symptoms Data:", dd);
        setSymptomsData(data);
      } catch (error) {
        console.error("Error fetching symptoms data:", error);
      }
    };

    fetchAllSymptoms();
  }, [symptoms]);

  useEffect(() => {
    console.log("Updated Symptoms Data:", symptomsData);
  }, [symptomsData]);
  const handleCancel = () => {
    // console.log("Updated Symptoms Data:", symptomsData);
    setModalVisible(false);
    setSymptoms("");
  };
  // other options in update health screen
  const handleUpdateMedicationDetails = () => {
    navigation.navigate("UpdateMedicationDetails");
    console.log("Update Medication Details button clicked");
  };

  const handleAddNewTestReport = () => {
    console.log("Add New Test Report button clicked");
  };

  return (
    <View style={styles.updateHealth}>
      {/* <Text style={styles.virtualCare}>Virtual Care</Text> */}
      <LinearGradient
        colors={["#E9F5FF", "#FFFFFF"]}
        style={[styles.optionButton, styles.HeadingView]} // Apply gradient to the TouchableOpacity style
        start={[0, 0]} // Optional: adjust the gradient direction
        end={[1, 0]} // Optional: adjust the gradient direction
      >
        {/* <View style={styles.HeadingView}> */}
        <Text style={styles.headingText}>Update Health</Text>
        {/* </View> */}
      </LinearGradient>

      <UpdateComponent
        text={"Update Symptoms"}
        onPress={handleUpdateSymptoms} // Call console.log() here
      />

      <UpdateComponent
        text={"Update Medication Details"}
        onPress={handleUpdateMedicationDetails} // Call console.log() here
      />
      <UpdateComponent
        text={"Add New Test Report"}
        onPress={handleAddNewTestReport} // Call console.log() here
      />
      {/* Include the new SymptomsModal component */}
      <SymptomsPopup
        visible={isModalVisible}
        dayCount={dayCount}
        symptoms={symptoms}
        setSymptoms={setSymptoms}
        onSave={handleSaveSymptoms}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default UpdateHealth;

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: "#F0F4FF",
  },
  updateHealth: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  virtualCare: {
    // position: "absolute", // Position the element absolutely within its parent
    // top: "6.5%", // Distance from the top of the screen
    // left: 20, // Distance from the left of the screen
    // fontSize: 24, // Adjust font size as needed
    // fontWeight: "bold", // Make the text bold
    // color: "#4B5189", // Optional: Add color to match the design
  },
  HeadingView: {
    marginTop: "20%",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "10%",
    borderRadius: 10,
    backgroundColor: "#F0F4FF",
    shadowColor: "#3B3DDF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
    marginBottom: "30%",
  },
  headingText: {
    fontSize: 30,
    color: "#4B5189",
    fontWeight: "bold",
  },
});
