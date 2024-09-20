import { Engine } from 'json-rules-engine';

// Define the rules
const rules = [
  {
    conditions: {
      all: [
        {
          any: [
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Life Threatening" },
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Immediate Vital Risk" }
          ]
        },
        { fact: 'country', operator: 'equal', value: "Canada" },
        { fact: 'countryOfOccurrence', operator: 'equal', value: "Canada" },
        { fact: 'productName', operator: 'equal', value: "EYE SHADOW-OMEGA (M) 1.5GM/.05OZ" },
        { fact: 'caseVersion', operator: 'equal', value: "Initial" },
        { fact: 'ue', operator: 'equal', value: "Anaphylactic Shock" }
      ]
    },
    event: {
      type: 'setPriority',
      params: {
        priority: 'High'
      }
    }
  },
  {
    conditions: {
      all: [
        {
          any: [
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Congenital Anomaly" },
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Important Medical Event" },
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Hospitalization" },
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Disability" },
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Temporary or Permanent Functional Incapacity" },
            { fact: 'seriousnessCriteria', operator: 'contains', value: "Others" }
          ]
        },
        { fact: 'country', operator: 'equal', value: "US" },
        { fact: 'countryOfOccurrence', operator: 'equal', value: "US" },
        { fact: 'productName', operator: 'equal', value: "EYE SHADOW-OMEGA (M) 1.5GM/.05OZ" },
        { fact: 'caseVersion', operator: 'equal', value: "Initial" },
        { fact: 'ue', operator: 'equal', value: "" }
      ]
    },
    event: {
      type: 'setPriority',
      params: {
        priority: 'Medium'
      }
    }
  }
];

// Function to create and configure the rules engine
const createRulesEngine = () => {
  const engine = new Engine();

  // Load the rules into the engine
  rules.forEach((rule) => engine.addRule(rule));

  return engine;
};

// Function to evaluate priority based on user data
const evaluatePriority = async (data) => {
  const engine = createRulesEngine();

  // Run the engine with the provided data
  const results = await engine.run(data);

  // Extract and return the priority from the engine's result
  const priorityEvent = results.events.find((event) => event.type === 'setPriority');
  return priorityEvent ? priorityEvent.params.priority : 'No Priority Set';
};

// Example usage: data from the user
const userData = {
  seriousnessCriteria: ["Life Threatening"],
  country: "Canada",
  countryOfOccurrence: "Canada",
  productName: "EYE SHADOW-OMEGA (M) 1.5GM/.05OZ",
  caseVersion: "Initial",
  ue: "Anaphylactic Shock",
};

// Running the evaluation
evaluatePriority(userData).then((priority) => {
  console.log(`Priority: ${priority}`); // Expected output: "Priority: High"
});

export default evaluatePriority;
