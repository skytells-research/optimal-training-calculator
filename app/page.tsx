'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Home() {
  const [assetsCount, setAssetsCount] = useState("");
  const [modelType, setModelType] = useState("VAE");
  const [isFinetune, setIsFinetune] = useState(false);
  const [isLoRA, setIsLoRA] = useState(false);
  const [hardware, setHardware] = useState("local");

  const [batchSize, setBatchSize] = useState("");
  const [learningRate, setLearningRate] = useState("");
  const [totalSteps, setTotalSteps] = useState("");
  const [epochs, setEpochs] = useState("");
  const [stepsPerEpoch, setStepsPerEpoch] = useState("");

  const [estimatedTime, setEstimatedTime] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [hints, setHints] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const hardwareSpecs = {
    "p3.2xlarge": { timePerStep: 0.02, costPerHour: 3.06 },
    "p3.8xlarge": { timePerStep: 0.015, costPerHour: 12.24 },
    "p3.16xlarge": { timePerStep: 0.01, costPerHour: 24.48 },
    "p4d.24xlarge": { timePerStep: 0.005, costPerHour: 32.77 },
    "g5.12xlarge": { timePerStep: 0.008, costPerHour: 4.10 },
  };

  useEffect(() => {
    if (showResults) {
      recalculateParams();
    }
  }, [assetsCount, batchSize, learningRate, totalSteps, epochs, stepsPerEpoch]);

  const resetResults = () => {
    setAssetsCount("");
    setModelType("VAE");
    setIsFinetune(false);
    setIsLoRA(false);
    setHardware("local");

    setBatchSize("");
    setLearningRate("");
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
    let bs, lr, ep, spe, totalStepsVal, time, cost;

    const assets = Number(assetsCount);
    const userBatchSize = parseInt(batchSize);
    const userLR = parseFloat(learningRate);
    const userTotalSteps = parseInt(totalSteps);
    const userEpochs = parseInt(epochs);
    const userStepsPerEpoch = parseInt(stepsPerEpoch);

    if (!assets || assets <= 0) {
      setShowResults(false);
      return;
    }

    // Batch Size Calculation
    if (!userBatchSize || userBatchSize <= 0) {
      bs = isLoRA ? 1 : Math.max(1, Math.floor(assets / 10));
      setBatchSize(bs.toString());
      steps.push(`\\text{Batch Size (Calculated)} = ${bs}`);
    } else {
      bs = userBatchSize;
      steps.push(`\\text{Batch Size} = ${bs}`);
    }

    // Steps per Epoch Calculation
    if (!userStepsPerEpoch || userStepsPerEpoch <= 0) {
      spe = Math.ceil(assets / bs);
      setStepsPerEpoch(spe.toString());
      steps.push(`\\text{Steps per Epoch (Calculated)} = \\left\\lceil \\frac{${assets}}{${bs}} \\right\\rceil = ${spe}`);
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
        hintsList.push("Warning: Total Steps and Epochs are inconsistent. Adjusting Total Steps.");
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
      steps.push(`\\text{Epochs (Calculated)} = \\left\\lceil \\frac{${totalStepsVal}}{${spe}} \\right\\rceil = ${ep}`);
    } else if (userEpochs > 0) {
      ep = userEpochs;
      totalStepsVal = ep * spe;
      setTotalSteps(totalStepsVal.toString());
      steps.push(`\\text{Epochs} = ${ep}`);
      steps.push(`\\text{Total Steps (Calculated)} = ${ep} \\times ${spe} = ${totalStepsVal}`);
    } else {
      // Neither provided
      if (isLoRA) {
        totalStepsVal = 1000;
      } else {
        totalStepsVal = spe * 10;
      }
      setTotalSteps(totalStepsVal.toString());
      ep = Math.ceil(totalStepsVal / spe);
      setEpochs(ep.toString());
      steps.push(`\\text{Total Steps (Calculated)} = ${totalStepsVal}`);
      steps.push(`\\text{Epochs (Calculated)} = ${ep}`);
    }

    // Learning Rate Calculation
    if (!userLR || userLR <= 0) {
      if (isLoRA) {
        lr = 0.0001;
      } else {
        lr = modelType === "VAE" ? 0.0003 :
             modelType === "Transformer" ? 0.0005 :
             modelType === "ResNet" ? 0.0008 :
             0.001; // Default for CNN
      }
      setLearningRate(lr.toString());
      steps.push(`\\text{Learning Rate (Calculated)} = ${lr}`);
    } else {
      lr = userLR;
      steps.push(`\\text{Learning Rate} = ${lr}`);
    }

    // Provide Hints Based on Learning Rate
    if (lr < 0.00001) {
      hintsList.push("Learning rate is very low, training may be slow.");
    } else if (lr > 0.01) {
      hintsList.push("Learning rate is high, may cause training instability.");
    } else {
      hintsList.push("Learning rate is within a typical range.");
    }

    // Provide Hints Based on Total Steps
    if (totalStepsVal < 1000) {
      hintsList.push("Total steps are low, model may underfit.");
    } else if (totalStepsVal > 100000) {
      hintsList.push("Total steps are high, may cause overfitting or long training time.");
    } else {
      hintsList.push("Total steps are within a typical range.");
    }

    // Estimated Time Calculation
    let timePerStep;
    if (hardware === "local") {
      timePerStep = 0.1;
      steps.push(`\\text{Estimated Time per Step (Local)} = ${timePerStep} \\text{ minutes}`);
    } else {
      const hardwareInfo = hardwareSpecs[hardware];
      timePerStep = hardwareInfo.timePerStep;
      steps.push(`\\text{Estimated Time per Step (${hardware})} = ${timePerStep} \\text{ minutes}`);
    }

    time = totalStepsVal * timePerStep;
    steps.push(`\\text{Estimated Total Time} = ${totalStepsVal} \\times ${timePerStep} = ${time.toFixed(2)} \\text{ minutes}`);
    setEstimatedTime(time.toFixed(2));

    // Estimated Cost Calculation
    if (hardware !== "local") {
      const hardwareInfo = hardwareSpecs[hardware];
      const timeInHours = time / 60;
      cost = timeInHours * hardwareInfo.costPerHour;
      steps.push(`\\text{Estimated Cost} = \\text{Time in Hours} \\times \\text{Cost per Hour} = ${timeInHours.toFixed(2)} \\times ${hardwareInfo.costPerHour} = \\$${cost.toFixed(2)}`);
      setEstimatedCost(cost.toFixed(2));
    } else {
      setEstimatedCost(null);
    }

    setCalculationSteps(steps);
    setHints(hintsList);
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
        <h1 className="text-md font-bold text-gray-600 mt-2">
          Skytells AI Research
        </h1>
        <h1 className="text-2xl font-bold text-center mt-4">
          Training Parameters Calculator
        </h1>
      </div>

      {/* Main Content */}
      <div
        className={`mt-8 ${
          showResults ? "flex flex-col lg:flex-row gap-8 justify-center" : "flex justify-center"
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
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Hardware Type:</span>
            <select
              value={hardware}
              onChange={(e) => setHardware(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="local">Local Training</option>
              <option value="p3.2xlarge">AWS p3.2xlarge (1 x V100 GPU)</option>
              <option value="p3.8xlarge">AWS p3.8xlarge (4 x V100 GPUs)</option>
              <option value="p3.16xlarge">AWS p3.16xlarge (8 x V100 GPUs)</option>
              <option value="p4d.24xlarge">AWS p4d.24xlarge (8 x A100 GPUs)</option>
              <option value="g5.12xlarge">AWS g5.12xlarge (1 x H100 GPU)</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Total Number of Assets:</span>
            <input
              type="number"
              value={assetsCount}
              onChange={(e) => setAssetsCount(e.target.value)}
              placeholder="Enter the number of images"
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>

          {/* Checkboxes */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isFinetune}
                onChange={(e) => setIsFinetune(e.target.checked)}
                className="mr-2"
              />
              <span>Finetuning</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isLoRA}
                onChange={(e) => setIsLoRA(e.target.checked)}
                className="mr-2"
              />
              <span>LoRA Applied</span>
            </label>
          </div>

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
                    <li key={index}>{hint}</li>
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
          href="https:/www.skytells.io"
          target="_blank"
          rel=""
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
