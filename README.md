# Optimal Training Parameters Calculator

![Training Parameters Calculator](https://images.theconversation.com/files/606130/original/file-20240710-17-okh0hd.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=1000&fit=clip)

A sophisticated web tool that helps machine learning practitioners calculate optimal training parameters for their models. Built with Next.js and React, this calculator provides intelligent recommendations for key hyperparameters based on your dataset and training requirements.


## Introduction

Determining the optimal training parameters for machine learning models is a common challenge. Incorrect hyperparameter choices can lead to underfitting, overfitting, or inefficient use of computational resources. The **Training Parameters Calculator** addresses this problem by providing intelligent, data-driven recommendations. It helps you:

- **Save time** by automating parameter calculations.
- **Optimize model performance** with appropriate hyperparameters.
- **Estimate training costs and time** based on hardware choices.

## Features

- 🧮 **Automatic Calculation**: Computes optimal batch size, learning rate, epochs, and more based on your inputs.
- 🔄 **Support for Multiple Model Architectures**:
  - **Variational Autoencoders (VAE)**
  - **Convolutional Neural Networks (CNN)**
  - **Residual Networks (ResNet)**
  - **Transformers**
  - **Deep Neural Networks (DNN)**
  - **Multimodal Diffusion Transformer Architecture (MDTA)**
- ⚡ **LoRa and Fine-Tuning Adjustments**:
  - **LoRa Applied**: Adjusts parameters when using Low-Rank Adaptation.
  - **Fine-Tuning**: Tailors recommendations for fine-tuning scenarios.
- 💰 **Cost Estimation**:
  - Provides estimated training costs for various AWS GPU instances.
  - Helps in budgeting and resource planning.
- ⏱️ **Training Time Predictions**:
  - Estimates total training time based on hardware and parameters.
- 📊 **Detailed Calculation Steps**:
  - Shows mathematical formulas and step-by-step calculations.
  - Enhances understanding of how parameters are derived.
- 💡 **Smart Hints and Recommendations**:
  - Offers color-coded hints to guide parameter selection.
  - Alerts for potential issues like underfitting or overfitting.
- 🎯 **Real-Time Recalculation**:
  - Updates recommendations instantly as inputs change.
- 🖥️ **Advanced Mode**:
  - Unlocks additional settings like GPU memory, image dimensions, precision, and optimizer selection.
  - Suitable for advanced users needing fine-grained control.
- 🛠️ **User-Friendly Interface**:
  - Intuitive design for easy navigation and input.
  - Responsive layout suitable for various devices.

## Use Cases

- **Machine Learning Researchers** optimizing training configurations.
- **Data Scientists** estimating training costs and planning resources.
- **Educators and Students** learning about hyperparameter tuning.
- **Engineering Teams** preparing for model deployment and scaling.
- **Project Managers** needing quick estimates for timelines and budgets.


## Installation Guide

This guide will help you set up and deploy the **Optimal Training Calculator** project on your local machine and optionally deploy it to the cloud using Vercel.

### Prerequisites

Before you start, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (version 14 or higher) - JavaScript runtime required to run and build the project.
- **[npm](https://www.npmjs.com/)** - Node package manager to handle dependencies and scripts.
- **[Git](https://git-scm.com/)** - Version control system to clone the repository.

### Installation Steps

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**

   Clone the Optimal Training Calculator repository from GitHub to your local machine.

   ```bash
   git clone https://github.com/skytells-research/optimal-training-calculator.git
   ```

2. **Navigate to the Project Directory**

   Change into the project directory to access its files.

   ```bash
   cd optimal-training-calculator
   ```

3. **Install Dependencies**

   Install the required packages and dependencies specified in the `package.json` file.

   ```bash
   npm install
   ```

4. **Run the Project Locally**

   To start the project on your local server, use the following command:

   ```bash
   npm run dev
   ```

   This will start the project locally, typically available at `http://localhost:3000`.

### Deploy on Vercel

You can easily deploy this project to Vercel, a platform for fast and scalable cloud deployment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fskytells-research%2Foptimal-training-calculator)

Click the button above to deploy directly to Vercel. This will guide you through the setup process on Vercel and allow you to deploy the project from the GitHub repository in one click.

## Usage

### Running the Application

To start the application locally, run:

```bash
npm run dev
```

This will start the development server. Open your browser and navigate to:

```
http://localhost:3000
```

### Using the Tool

1. **Select Model Type**

   Choose the type of model you're training (e.g., VAE, CNN, ResNet, Transformer, etc.).

2. **Select Hardware Type**

   Choose the hardware configuration you plan to use for training. Options include local training and various AWS GPU instances.

3. **Enter Total Number of Assets**

   Input the total number of images or data samples in your dataset.

4. **Optional Settings**

   - **Advanced Mode**: Enable to access additional settings like GPU memory, image dimensions, precision, and optimizer selection.
   - **Finetuning**: Check if you're fine-tuning an existing model.
   - **LoRa Applied**: Check if you're using LoRa (Low-Rank Adaptation). When enabled, you can set the LoRa rank too.

5. **Calculate Parameters**

   Click the **Calculate** button to compute optimal training parameters.

6. **Review and Adjust**

   - The calculated parameters and estimates will be displayed, including batch size, learning rate, epochs, and more.
   - Adjust parameters like batch size, learning rate, etc., if needed. The results will update automatically with your changes.
   - View **Hints** and **Calculation Steps** for detailed insights.

7. **Reset**

   Click the **Reset** button to clear all inputs and start over.

## Changelog

For detailed information about updates, new features, and improvements, please refer to the [Changelog](/changelog.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

[DrHazemAli](https://github.com/DrHazemAli) - Skytells AI Research

**Repository:** [optimal-training-calculator](https://github.com/skytells-research/optimal-training-calculator)

---

**Note**: If you have any questions or need further assistance, feel free to reach out!