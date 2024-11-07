# Changelog

This changelog highlights the new features and improvements made to the **Training Parameters Calculator** application. 
The updates are based on the comparison between the initial version and the enhanced version of the code.

---
## **Version 1.0.1**

### **New Features and Improvements**

#### 1. **Advanced Mode Toggle**

- **Feature**: Introduced an **Advanced Mode** toggle to the user interface.
- **Functionality**:
  - When **Advanced Mode** is **off**, only basic fields are displayed:
    - Model Type
    - Number of Assets
    - Hardware Type
    - Finetuning
    - LoRa Applied
  - When **Advanced Mode** is **on**, additional advanced fields are displayed:
    - GPU Memory
    - Image Width, Height, Channels
    - Precision
    - Optimizer Selection
- **Code Changes**:
  - Added a new state variable `isAdvancedMode` to manage the toggle:
    ```jsx
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);
    ```
  - Moved the "Advanced Mode" toggle to appear before the "Finetuning" checkbox for better user flow.
  - Updated conditional rendering to show/hide advanced fields based on `isAdvancedMode`.

#### 2. **LoRa Support**

- **Feature**: Added support for **LoRa (Low-Rank Adaptation)** training.
- **Functionality**:
  - Users can now enable or disable LoRa by checking the "LoRa Applied" checkbox.
  - When LoRa is applied:
    - **Batch Size** is set to `1`.
    - **Optimizer** defaults to `"adamw8bit"`.
    - **LoRa Rank** field becomes visible with a default value of `"32"`.
- **Code Changes**:
  - Renamed all instances of `"LoRA"` to `"LoRa"` for consistency.
  - Introduced new state variables:
    ```jsx
    const [isLoRa, setIsLoRa] = useState(false);
    const [loraRank, setLoraRank] = useState("32");
    ```
  - Updated the `recalculateParams` function to handle LoRa-specific logic.

#### 3. **Optimizer Selection**

- **Feature**: Expanded the list of optimizers and added a selection dropdown.
- **Functionality**:
  - Users can now select from a range of optimizers:
    ```
    prodigy, adam8bit, adamw8bit, lion8bit, adam, adamw, lion, adagrad, adafactor
    ```
  - Default optimizer is set to `"adamw8bit"`.
- **Code Changes**:
  - Added a new state variable `optimizer`:
    ```jsx
    const [optimizer, setOptimizer] = useState("adamw8bit");
    ```
  - Created an array `optimizerOptions` for available optimizers.
  - Implemented a dropdown menu for optimizer selection in the advanced fields.

#### 4. **Image Parameters**

- **Feature**: Introduced fields for image-specific parameters.
- **Functionality**:
  - Users can now input:
    - **Image Width** and **Height** (defaulted to `"1024"`).
    - **Image Channels** (defaulted to `"3"`).
    - **Precision** (16-bit or 32-bit).
- **Code Changes**:
  - Added state variables:
    ```jsx
    const [imageWidth, setImageWidth] = useState("1024");
    const [imageHeight, setImageHeight] = useState("1024");
    const [imageChannels, setImageChannels] = useState("3");
    const [precision, setPrecision] = useState("16");
    ```
  - These fields are conditionally rendered when **Advanced Mode** is enabled and the selected model is an image model.

#### 5. **GPU Memory Handling**

- **Feature**: Enhanced GPU memory input handling.
- **Functionality**:
  - When **Advanced Mode** is off and the hardware selected is "Local Training", the **GPU Memory** field is displayed.
  - Validates GPU memory input and provides hints if not properly set.
- **Code Changes**:
  - Adjusted the conditional rendering to display the **GPU Memory** field when either `isAdvancedMode` is true or `hardware` is `"local"`:
    ```jsx
    {(isAdvancedMode || hardware === "local") && (
      // GPU Memory Field
    )}
    ```
  - Updated validation logic in `recalculateParams` to check for valid GPU memory.

#### 6. **Enhanced Hardware Specifications**

- **Feature**: Updated hardware specifications with more details.
- **Functionality**:
  - **`hardwareSpecs`** object now includes `gpuMemory` for each hardware type.
- **Code Changes**:
  - Modified the `hardwareSpecs` object to include `gpuMemory`:
    ```jsx
    const hardwareSpecs = {
      "local": { timePerStep: 0.1, costPerHour: 0, gpuMemory: 0 },
      // Other hardware options...
    };
    ```

#### 7. **Color-Coded Hints**

- **Feature**: Implemented color-coded hints for better user guidance.
- **Functionality**:
  - Hints are displayed with colors based on their importance:
    - **Green**: Informational messages.
    - **Orange**: Warnings.
    - **Red**: Critical alerts.
- **Code Changes**:
  - Updated the `hints` state to be an array of objects containing `message` and `level`:
    ```jsx
    hintsList.push({ message: "Total steps are within a typical range.", level: "green" });
    ```
  - Modified the rendering of hints to apply text colors based on the `level`.

#### 8. **User Interface Enhancements**

- **Feature**: Improved the overall user interface for better usability.
- **Changes**:
  - Reorganized the placement of checkboxes and input fields for a logical flow.
  - Ensured that the "Advanced Mode" toggle is placed before the "Finetuning" and "LoRa Applied" checkboxes.
  - Adjusted labels and placeholders for clarity.
  - Implemented conditional rendering to show or hide fields based on user selections.

#### 9. **Code Refactoring**

- **Improvement**: Refactored code for better readability and maintainability.
- **Changes**:
  - Organized state variables and grouped related ones together.
  - Cleaned up the `useEffect` dependencies to include all necessary variables.
  - Simplified conditional rendering logic.
  - Ensured consistent naming conventions throughout the codebase.

---

### **Summary**

The enhanced version of the **Training Parameters Calculator** introduces significant new features and improvements, including:

- An **Advanced Mode** for accessing additional settings.
- **LoRa** support with customizable rank.
- Expanded **optimizer** options.
- Input fields for **image-specific parameters**.
- Improved handling of **GPU memory** and **hardware specifications**.
- **Color-coded hints** to guide users effectively.
- User interface enhancements for a more intuitive experience.
- Refactored code for better maintainability.

These updates aim to provide users with greater flexibility and control over their training parameter configurations, catering to both beginners and advanced users.

---

**Note**: If you have any questions or need further assistance with the updates, feel free to reach out!