import { Engine } from 'json-rules-engine';

// Define the rules
const rules = [
  {
    conditions: {
      all: [
        {
					fact: "seriousnessCriteria",
					operator: "any",
					value: ["Life Threatening", "Immediate Vital Risk"],
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
					fact: "seriousnessCriteria",
					operator: "any",
					value: ["Congenital Anomaly","Important Medical Event","Hospitalization","Disability","Temporary or Permanent Functional Incapacity","Others"],
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
	
	engine.addOperator("any", (factValue, ruleValue) => {
		return factValue.some((val) => ruleValue.includes(val));
	});
	
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

const userData2 = {
  seriousnessCriteria: ["Disability"],
  country: "Canada",
  countryOfOccurrence: "Canada",
  productName: "EYE SHADOW-OMEGA (M) 1.5GM/.05OZ",
  caseVersion: "Initial",
  ue: "",
};

// Running the evaluation
evaluatePriority(userData).then((priority) => {
  console.log(`Priority: ${priority}`); // Expected output: "Priority: High"
});

evaluatePriority(userData2).then((priority) => {
  console.log(`Priority: ${priority}`);
});

export default evaluatePriority;
