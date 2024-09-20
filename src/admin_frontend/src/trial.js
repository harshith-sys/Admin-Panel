import { Engine } from 'json-rules-engine';

// Sample Obtained JSON
let ObtainedJSON = [
  {
    eventVerbatim: "Anaphylactic Reaction",
    regionalValue: {
      emea: ["Immediate Vital Risk"],
      apac: ["Life Threatening", "Others"],
      canada: ["Life Threatening", "Other Medically Important Condition"],
      na: [
        "Life Threatening",
        "Other Serious or Important Medical Events",
        "Required Intervention To Prevent Permanent Impairment/Damage",
      ],
      latam: ["Life Threatening", "Other Serious or Important Medical Events"],
    },
  },
  {
    eventVerbatim: "Anaphylactic Shock",
    regionalValue: {
      emea: ["Immediate Vital Risk"],
      apac: ["Life Threatening", "Others"],
      canada: ["Life Threatening", "Other Medically Important Condition"],
      na: [
        "Life Threatening",
        "Other Serious or Important Medical Events",
        "Required Intervention To Prevent Permanent Impairment/Damage",
      ],
      latam: ["Life Threatening", "Other Serious or Important Medical Events"],
    },
  },
  {
    eventVerbatim: "Angioedema",
    regionalValue: {
      emea: ["Immediate Vital Risk"],
      apac: ["Life Threatening", "Others"],
      canada: ["Life Threatening", "Other Medically Important Condition"],
      na: [
        "Life Threatening",
        "Other Serious or Important Medical Events",
        "Required Intervention To Prevent Permanent Impairment/Damage",
      ],
      latam: ["Life Threatening", "Other Serious or Important Medical Events"],
    },
  },
];

// Function to create rules based on ObtainedJSON
const createRulesFromJSON = (ObtainedJSON) => {
  return ObtainedJSON.map((event) => ({
    conditions: {
      all: [
        {
          fact: "eventVerbatim",
          operator: "equal",
          value: event.eventVerbatim,
        },
        ...Object.keys(event.regionalValue).map((region) => ({
          fact: region,
          operator: "any",
          value: event.regionalValue[region],
        })),
      ],
    },
    event: {
      type: "setPriority",
      params: {
        priority: "High",
      },
    },
  }));
};


// Create the rules engine
const createRulesEngine = (rules) => {
  const engine = new Engine();

	engine.addOperator("any", (factValue, ruleValue) => {
		return factValue.some((val) => ruleValue.includes(val));
	});

  rules.forEach((rule) => engine.addRule(rule));
  return engine;
};

// Function to evaluate priority based on user data
const evaluatePriority = async (data, rules) => {
  const engine = createRulesEngine(rules);

  // Run the engine with the provided data
  const results = await engine.run(data);

  // Extract and return the priority from the engine's result
  const priorityEvent = results.events.find((event) => event.type === "setPriority");
  return priorityEvent ? priorityEvent.params.priority : "No Priority Set";
};

// Generate rules from the ObtainedJSON
const rules = createRulesFromJSON(ObtainedJSON);

// Example usage: Data from the user
const userData = {
  eventVerbatim: "Anaphylactic Shock",
  emea: ["Immediate Vital Risk"],
  apac: ["Life Threatening", "Others"],
  canada: ["Life Threatening", "Other Medically Important Condition"],
  // Add all facts as they exist in rules
  na: ["Life Threatening", "Other Serious or Important Medical Events"],
  latam: ["Life Threatening", "Other Serious or Important Medical Events"],
};

// Running the evaluation
evaluatePriority(userData, rules).then((priority) => {
  console.log(`Priority: ${priority}`); // Expected output: "Priority: High"
});

export default evaluatePriority;