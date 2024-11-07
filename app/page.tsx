'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Home() {
  // State Variables
  const [assetsCount, setAssetsCount] = useState("");
  const [modelType, setModelType] = useState("VAE");
  const [isAdvancedMode, setIsAdvancedMode] = useState(false); // Advanced Mode Toggle
  const [isFinetune, setIsFinetune] = useState(false);
  const [isLoRa, setIsLoRa] = useState(false);
  const [loraRank, setLoraRank] = useState("32");
  const [hardware, setHardware] = useState("local");

  // Input Fields
  const [gpuMemory, setGpuMemory] = useState("");
  const [imageWidth, setImageWidth] = useState("1024");
  const [imageHeight, setImageHeight] = useState("1024");
  const [imageChannels, setImageChannels] = useState("3");
  const [precision, setPrecision] = useState("16"); // Default to 16-bit precision

  const [batchSize, setBatchSize] = useState("1"); // Default to 1
  const [learningRate, setLearningRate] = useState("");
  const [optimizer, setOptimizer] = useState("adamw8bit"); // Default optimizer
  const [totalSteps, setTotalSteps] = useState("");
  const [epochs, setEpochs] = useState("");
  const [stepsPerEpoch, setStepsPerEpoch] = useState("");

  const [estimatedTime, setEstimatedTime] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [hints, setHints] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const hardwareSpecs = {
    "local": { timePerStep: 0.1, costPerHour: 0, gpuMemory: 0 },
    "p3.2xlarge": { timePerStep: 0.02, costPerHour: 3.06, gpuMemory: 16 },
    "p3.8xlarge": { timePerStep: 0.015, costPerHour: 12.24, gpuMemory: 64 },
    "p3.16xlarge": { timePerStep: 0.01, costPerHour: 24.48, gpuMemory: 128 },
    "p4d.24xlarge": { timePerStep: 0.005, costPerHour: 32.77, gpuMemory: 320 },
    "g5.12xlarge": { timePerStep: 0.008, costPerHour: 4.10, gpuMemory: 24 },
    "g5.48xlarge": { timePerStep: 0.006, costPerHour: 14.77, gpuMemory: 96 },
    "p5.48xlarge": { timePerStep: 0.003, costPerHour: 37.20, gpuMemory: 640 }, // H100 GPUs
  };

  const imageModelTypes = [
    "VAE",
    "CNN",
    "ResNet",
    "Transformer",
    "Multimodal Diffusion Transformer Architecture",
  ];

  const optimizerOptions = [
    "prodigy",
    "adam8bit",
    "adamw8bit",
    "lion8bit",
    "adam",
    "adamw",
    "lion",
    "adagrad",
    "adafactor",
  ];

  useEffect(() => {
    if (showResults) {
      recalculateParams();
    }
  }, [
    assetsCount,
    batchSize,
    learningRate,
    totalSteps,
    epochs,
    stepsPerEpoch,
    gpuMemory,
    imageWidth,
    imageHeight,
    imageChannels,
    precision,
    modelType,
    isLoRa,
    loraRank,
    optimizer,
    hardware,
    isAdvancedMode,
  ]);

  const resetResults = () => {
    setAssetsCount("");
    setModelType("VAE");
    setIsAdvancedMode(false);
    setIsFinetune(false);
    setIsLoRa(false);
    setLoraRank("32");
    setHardware("local");

    setGpuMemory("");
    setImageWidth("1024");
    setImageHeight("1024");
    setImageChannels("3");
    setPrecision("16");

    setBatchSize("1");
    setLearningRate("");
    setOptimizer("adamw8bit");
    setEpochs("");
    setStepsPerEpoch("");
    setTotalSteps("");
    setEstimatedTime(null);
    setEstimatedCost(null);
    setCalculationSteps([]);
    setHints([]);
    setShowResults(false);
  };

  const calculateParams = () => {
    // Perform initial calculation
    recalculateParams();
    setShowResults(true);
  };

  const recalculateParams = () => {
    let steps = [];
    let hintsList = [];
    let bs = 1,
      lr,
      ep,
      spe,
      totalStepsVal,
      time,
      cost,
      opt = optimizer;

    const assets = Number(assetsCount);
    const userBatchSize = parseInt(batchSize);
    const userLR = parseFloat(learningRate);
    const userTotalSteps = parseInt(totalSteps);
    const userEpochs = parseInt(epochs);
    const userStepsPerEpoch = parseInt(stepsPerEpoch);
    const userLoraRank = parseInt(loraRank);

    const gpuMem = Number(gpuMemory);
    const imgWidth = Number(imageWidth);
    const imgHeight = Number(imageHeight);
    const imgChannels = Number(imageChannels);
    const precisionBits = Number(precision);

    if (!assets || assets <= 0) {
      setShowResults(false);
      return;
    }

    // Validate GPU Memory
    if ((isAdvancedMode || hardware === "local") && (!gpuMem || gpuMem <= 0)) {
      hintsList.push({ message: "Please enter a valid GPU memory size.", level: "red" });
    }

    // Batch Size Recommendation
    if (isLoRa) {
      bs = 1;
      setBatchSize("1");
      steps.push(`\\text{Batch Size (LoRa Applied)} = ${bs}`);
    } else if (imageModelTypes.includes(modelType)) {
      // For image models without LoRa
      bs = 1;
      setBatchSize("1");
      steps.push(`\\text{Batch Size} = ${bs}`);
    } else {
      // For non-image models
      bs = 1;
      setBatchSize("1");
      steps.push(`\\text{Batch Size} = ${bs}`);
    }

    // Optimizer Recommendation
    if (isLoRa && imageModelTypes.includes(modelType)) {
      opt = "adamw8bit";
      setOptimizer(opt);
      steps.push(`\\text{Optimizer (LoRa with Images)} = \\text{${opt}}`);
    } else {
      opt = optimizer || "adamw";
      setOptimizer(opt);
      steps.push(`\\text{Optimizer} = \\text{${opt}}`);
    }

    // LoRa Rank
    if (isLoRa) {
      steps.push(`\\text{LoRa Rank} = ${userLoraRank || 32}`);
    }

    // Steps per Epoch Calculation
    if (!userStepsPerEpoch || userStepsPerEpoch <= 0) {
      spe = Math.ceil(assets / bs);
      setStepsPerEpoch(spe.toString());
      steps.push(
        `\\text{Steps per Epoch} = \\left\\lceil \\frac{${assets}}{${bs}} \\right\\rceil = ${spe}`
      );
    } else {
      spe = userStepsPerEpoch;
      steps.push(`\\text{Steps per Epoch} = ${spe}`);
    }

    // Total Steps and Epochs Calculation
    if (userTotalSteps > 0 && userEpochs > 0) {
      // Both provided
      totalStepsVal = userTotalSteps;
      ep = userEpochs;
      const calculatedTotalSteps = ep * spe;
      if (calculatedTotalSteps !== totalStepsVal) {
        hintsList.push({
          message: "Warning: Total Steps and Epochs are inconsistent. Adjusting Total Steps.",
          level: "orange",
        });
        totalStepsVal = calculatedTotalSteps;
        setTotalSteps(totalStepsVal.toString());
        steps.push(`\\text{Adjusted Total Steps} = ${ep} \\times ${spe} = ${totalStepsVal}`);
      }
      steps.push(`\\text{Total Steps} = ${totalStepsVal}`);
      steps.push(`\\text{Epochs} = ${ep}`);
    } else if (userTotalSteps > 0) {
      totalStepsVal = userTotalSteps;
      ep = Math.ceil(totalStepsVal / spe);
      setEpochs(ep.toString());
      steps.push(`\\text{Total Steps} = ${totalStepsVal}`);
      steps.push(`\\text{Epochs} = ${ep}`);
    } else if (userEpochs > 0) {
      ep = userEpochs;
      totalStepsVal = ep * spe;
      setTotalSteps(totalStepsVal.toString());
      steps.push(`\\text{Epochs} = ${ep}`);
      steps.push(`\\text{Total Steps} = ${totalStepsVal}`);
    } else {
      // Neither provided, use defaults
      if (isLoRa) {
        totalStepsVal = 1000;
        setTotalSteps(totalStepsVal.toString());
        ep = Math.ceil(totalStepsVal / spe);
        setEpochs(ep.toString());
        steps.push(`\\text{Total Steps (LoRa Default)} = ${totalStepsVal}`);
        steps.push(`\\text{Epochs} = ${ep}`);
      } else {
        totalStepsVal = 3000;
        setTotalSteps(totalStepsVal.toString());
        ep = Math.ceil(totalStepsVal / spe);
        setEpochs(ep.toString());
        steps.push(`\\text{Total Steps (Default)} = ${totalStepsVal}`);
        steps.push(`\\text{Epochs} = ${ep}`);
      }
    }

    // Learning Rate Calculation
    if (!userLR || userLR <= 0) {
      if (isLoRa) {
        lr = 0.0004;
      } else {
        lr = getDefaultLearningRate(modelType);
      }
      setLearningRate(lr.toString());
      steps.push(`\\text{Learning Rate} = ${lr}`);
    } else {
      lr = userLR;
      steps.push(`\\text{Learning Rate} = ${lr}`);
    }

    // Provide Hints Based on Learning Rate
    if (lr < 0.00001) {
      hintsList.push({
        message: "Learning rate is very low, training may be slow.",
        level: "orange",
      });
    } else if (lr > 0.01) {
      hintsList.push({
        message: "Learning rate is high, may cause training instability.",
        level: "red",
      });
    } else {
      hintsList.push({
        message: "Learning rate is within a typical range.",
        level: "green",
      });
    }

    // Provide Hints Based on Total Steps
    if (totalStepsVal < 1000) {
      hintsList.push({
        message: "Total steps are low, model may underfit.",
        level: "orange",
      });
    } else if (totalStepsVal > 100000) {
      hintsList.push({
        message: "Total steps are high, may cause overfitting or long training time.",
        level: "orange",
      });
    } else {
      hintsList.push({
        message: "Total steps are within a typical range.",
        level: "green",
      });
    }

    // Estimated Time Calculation
    let timePerStep;
    const hardwareInfo = hardwareSpecs[hardware];
    if (hardware === "local") {
      timePerStep = 0.1;
      steps.push(`\\text{Estimated Time per Step (Local)} = ${timePerStep} \\text{ minutes}`);
    } else {
      timePerStep = hardwareInfo.timePerStep;
      steps.push(`\\text{Estimated Time per Step (${hardware})} = ${timePerStep} \\text{ minutes}`);
    }

    time = totalStepsVal * timePerStep;
    steps.push(
      `\\text{Estimated Total Time} = ${totalStepsVal} \\times ${timePerStep} = ${time.toFixed(
        2
      )} \\text{ minutes}`
    );
    setEstimatedTime(time.toFixed(2));

    // Estimated Cost Calculation
    if (hardware !== "local") {
      const timeInHours = time / 60;
      cost = timeInHours * hardwareInfo.costPerHour;
      steps.push(
        `\\text{Estimated Cost} = ${timeInHours.toFixed(2)} \\times ${
          hardwareInfo.costPerHour
        } = \\$${cost.toFixed(2)}`
      );
      setEstimatedCost(cost.toFixed(2));
    } else {
      setEstimatedCost(null);
    }

    setCalculationSteps(steps);
    setHints(hintsList);
  };

  // Function to get default learning rate based on model type
  const getDefaultLearningRate = (modelType) => {
    switch (modelType) {
      case "VAE":
      case "Transformer":
      case "ResNet":
      case "CNN":
      case "Multimodal Diffusion Transformer Architecture":
        return 0.0001;
      case "DNN":
        return 0.001;
      default:
        return 0.0001;
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-sans">
      {/* Header */}
      <div className="flex flex-col items-center">
        <Image
          className="dark:invert mx-auto w-auto h-auto max-w-[180px] max-h-[38px]"
          src="/logo.png"
          alt="Skytells AI Research"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-md font-bold text-gray-600 mt-2">Skytells AI Research</h1>
        <h1 className="text-2xl font-bold text-center mt-4">Training Parameters Calculator</h1>
      </div>

      {/* Main Content */}
      <div
        className={`mt-8 ${
          showResults
            ? "flex flex-col lg:flex-row gap-8 justify-center"
            : "flex justify-center"
        }`}
      >
        {/* Input Form */}
        <div className="flex flex-col gap-4 w-full max-w-md">
        

         

          {/* Initial Inputs */}
          <label className="flex flex-col">
            <span className="mb-1">Model Type:</span>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="VAE">Variational Autoencoder (VAE)</option>
              <option value="CNN">Convolutional Neural Network (CNN)</option>
              <option value="ResNet">Residual Network (ResNet)</option>
              <option value="Transformer">Transformer</option>
              <option value="Multimodal Diffusion Transformer Architecture">
                Multimodal Diffusion Transformer Architecture
              </option>
              <option value="DNN">Deep Neural Network (DNN)</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Hardware Type:</span>
            <select
              value={hardware}
              onChange={(e) => {
                setHardware(e.target.value);
                const selectedHardware = hardwareSpecs[e.target.value];
                if (selectedHardware && selectedHardware.gpuMemory > 0) {
                  setGpuMemory(selectedHardware.gpuMemory.toString());
                } else {
                  setGpuMemory("");
                }
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="local">Local Training</option>
              <option value="p3.2xlarge">AWS p3.2xlarge (1 x V100 GPU, 16 GB)</option>
              <option value="p3.8xlarge">AWS p3.8xlarge (4 x V100 GPUs, 64 GB)</option>
              <option value="p3.16xlarge">AWS p3.16xlarge (8 x V100 GPUs, 128 GB)</option>
              <option value="p4d.24xlarge">AWS p4d.24xlarge (8 x A100 GPUs, 320 GB)</option>
              <option value="g5.12xlarge">AWS g5.12xlarge (1 x A10G GPU, 24 GB)</option>
              <option value="g5.48xlarge">AWS g5.48xlarge (4 x A10G GPUs, 96 GB)</option>
              <option value="p5.48xlarge">AWS p5.48xlarge (8 x H100 GPUs, 640 GB)</option>
            </select>
          </label>

          {/* Total Number of Assets */}
          <label className="flex flex-col">
            <span className="mb-1">Total Number of Assets:</span>
            <input
              type="number"
              value={assetsCount}
              onChange={(e) => setAssetsCount(e.target.value)}
              placeholder="Enter the number of assets"
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>

          {/* GPU Memory Field */}
          {(isAdvancedMode || hardware === "local") && (
            <label className="flex flex-col">
              <span className="mb-1">GPU Memory (GB):</span>
              <input
                type="number"
                value={gpuMemory}
                onChange={(e) => setGpuMemory(e.target.value)}
                placeholder="Enter GPU memory size in GB"
                className="border border-gray-300 rounded px-2 py-1"
              />
            </label>
          )}

          {/* Conditionally Render Advanced Fields */}
          {isAdvancedMode && (
            <>
              {/* Conditionally Render Image Inputs */}
              {imageModelTypes.includes(modelType) && (
                <>
                  <label className="flex flex-col">
                    <span className="mb-1">Image Width (pixels):</span>
                    <input
                      type="number"
                      value={imageWidth}
                      onChange={(e) => setImageWidth(e.target.value)}
                      placeholder="Enter image width"
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="mb-1">Image Height (pixels):</span>
                    <input
                      type="number"
                      value={imageHeight}
                      onChange={(e) => setImageHeight(e.target.value)}
                      placeholder="Enter image height"
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="mb-1">Image Channels:</span>
                    <input
                      type="number"
                      value={imageChannels}
                      onChange={(e) => setImageChannels(e.target.value)}
                      placeholder="Enter number of channels (e.g., 3 for RGB)"
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="mb-1">Precision (bits):</span>
                    <select
                      value={precision}
                      onChange={(e) => setPrecision(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="16">16-bit (FP16)</option>
                      <option value="32">32-bit (FP32)</option>
                    </select>
                  </label>
                </>
              )}

              {/* Optimizer Selection */}
              <label className="flex flex-col">
                <span className="mb-1">Optimizer:</span>
                <select
                  value={optimizer}
                  onChange={(e) => setOptimizer(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  {optimizerOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          {/* Hidden Fields - Shown After Calculation */}
          {showResults && (
            <>
              <label className="flex flex-col">
                <span className="mb-1">Batch Size:</span>
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                  placeholder="Enter batch size"
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </label>

              <label className="flex flex-col">
                <span className="mb-1">Steps per Epoch:</span>
                <input
                  type="number"
                  value={stepsPerEpoch}
                  onChange={(e) => setStepsPerEpoch(e.target.value)}
                  placeholder="Enter steps per epoch"
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </label>

              <label className="flex flex-col">
                <span className="mb-1">Learning Rate:</span>
                <input
                  type="number"
                  step="any"
                  value={learningRate}
                  onChange={(e) => setLearningRate(e.target.value)}
                  placeholder="Enter learning rate"
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </label>

              {isLoRa && (
                <label className="flex flex-col">
                  <span className="mb-1">Optimizer:</span>
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {optimizerOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="flex flex-col">
                <span className="mb-1">Total Steps:</span>
                <input
                  type="number"
                  value={totalSteps}
                  onChange={(e) => setTotalSteps(e.target.value)}
                  placeholder="Enter total steps"
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </label>

              <label className="flex flex-col">
                <span className="mb-1">Epochs:</span>
                <input
                  type="number"
                  value={epochs}
                  onChange={(e) => setEpochs(e.target.value)}
                  placeholder="Enter epochs"
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </label>
            </>
          )}
           {/* LoRa Rank Field */}
           {isLoRa && (
            <label className="flex flex-col">
              <span className="mb-1">LoRa Rank:</span>
              <input
                type="number"
                value={loraRank}
                onChange={(e) => setLoraRank(e.target.value)}
                placeholder="Enter LoRa rank (e.g., 32)"
                className="border border-gray-300 rounded px-2 py-1"
              />
            </label>
          )}
 {/* Checkboxes */}
 <div className="flex flex-col gap-2">
    {/* Advanced Mode Toggle */}
    <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAdvancedMode}
              onChange={(e) => setIsAdvancedMode(e.target.checked)}
              className="mr-2"
            />
            <span>Advanced Mode</span>
          </label>
            {/* Finetuning Checkbox */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isFinetune}
                onChange={(e) => setIsFinetune(e.target.checked)}
                className="mr-2"
              />
              <span>Finetuning</span>
            </label>

            {/* LoRa Applied Checkbox */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isLoRa}
                onChange={(e) => setIsLoRa(e.target.checked)}
                className="mr-2"
              />
              <span>LoRa Applied</span>
            </label>
          </div>

         
          {/* Buttons */}
          <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
            {!showResults ? (
              <button
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white gap-2 hover:bg-gray-800 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={(e) => {
                  e.preventDefault();
                  calculateParams();
                }}
              >
                Calculate
              </button>
            ) : (
              <button
                className="rounded-full border border-gray-300 transition-colors flex items-center justify-center bg-white text-black gap-2 hover:bg-gray-100 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={(e) => {
                  e.preventDefault();
                  resetResults();
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="mt-8 w-full max-w-md">
            <h2 className="text-xl font-semibold">Optimal Training Parameters:</h2>
            <ul className="list-disc list-inside">
              <li>Batch Size: {batchSize}</li>
              <li>Learning Rate: {learningRate}</li>
              {isLoRa && <li>LoRa Rank: {loraRank}</li>}
              <li>Optimizer: {optimizer}</li>
              <li>Epochs: {epochs}</li>
              <li>Steps per Epoch: {stepsPerEpoch}</li>
              <li>Total Steps: {totalSteps}</li>
              <li>Estimated Time: {estimatedTime} minutes</li>
            </ul>

            {estimatedCost !== null && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Estimated Cost:</h3>
                <p>${estimatedCost}</p>
              </div>
            )}

            {hints.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Hints:</h3>
                <ul className="list-disc list-inside">
                  {hints.map((hint, index) => (
                    <li
                      key={index}
                      className={
                        hint.level === "green"
                          ? "text-green-600"
                          : hint.level === "orange"
                          ? "text-orange-600"
                          : "text-red-600"
                      }
                    >
                      {hint.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h3 className="text-lg font-medium mt-4">Calculation Steps:</h3>
            {calculationSteps.map((step, index) => (
              <BlockMath key={index}>{step}</BlockMath>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.skytells.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Skytells AI Research
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/DrHazemAli"
          target="_blank"
          rel="noopener noreferrer"
        >
          @DrHazemAli
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/skytells-research/optimal-training-calculator"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository →
        </a>
      </footer>
    </div>
  );
}
