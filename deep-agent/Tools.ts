import { tool } from "@langchain/core/tools";
import { 
    cardioAgent, 
    skinAgent, 
    neuroAgent, 
    opghthalAgent, 
    gyneAgent, 
    orthoAgent, 
    sexologistAgent, 
    ENTAgent, 
    psycoAgent, 
    pediaAgent 
} from "./subAgent";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createDiagnosisTool = (agent: any, name: string, description: string) => {
    return tool(
        async ({ age, gender, symptoms, history }) => {
            const prompt = `
You are receiving patient details.

Age: ${age}
Gender: ${gender}
Symptoms: ${symptoms}
Medical History: ${history ?? "None"}

Diagnose the condition and respond according to instructions.
`.trim();

            const result = await agent.invoke({
                messages: [{ role: "user", content: prompt }]
            });

            const lastMessage = result.messages.at(-1);
            return lastMessage.text;
        },
        {
            name,
            description,
            schema: z.object({
                age: z.number(),
                gender: z.enum(["male", "female", "other"]),
                symptoms: z.string(),
                history: z.string().optional(),
            }),
        }
    );
};

export const CardioExpertTool = createDiagnosisTool(
    cardioAgent,
    "cardio_Agent",
    "Use this agent for diagnosing heart-related conditions. Provide symptoms, age, gender, and medical history."
);

export const SkinExpertTool = createDiagnosisTool(
    skinAgent,
    "skin_Agent",
    "Use this agent for diagnosing skin-related conditions. Provide symptoms, age, gender, and medical history."
);

export const NeuroExpertTool = createDiagnosisTool(
    neuroAgent,
    "neuro_Agent",
    "Use this agent for diagnosing nerve and neurological conditions. Provide symptoms, age, gender, and medical history."
);

export const OpthalmologyExpertTool = createDiagnosisTool(
    opghthalAgent,
    "opthalmology_Agent",
    "Use this agent for diagnosing eye-related conditions. Provide symptoms, age, gender, and medical history."
);

export const GyneExpertTool = createDiagnosisTool(
    gyneAgent,
    "gyne_Agent",
    "Use this agent for diagnosing women's health conditions. Provide symptoms, age, gender, and medical history."
);

export const OrthoExpertTool = createDiagnosisTool(
    orthoAgent,
    "ortho_Agent",
    "Use this agent for diagnosing bone and orthopedic conditions. Provide symptoms, age, gender, and medical history."
);

export const SexologistExpertTool = createDiagnosisTool(
    sexologistAgent,
    "sexologist_Agent",
    "Use this agent for diagnosing sexual health conditions. Provide symptoms, age, gender, and medical history."
);

export const ENTExpertTool = createDiagnosisTool(
    ENTAgent,
    "ent_Agent",
    "Use this agent for diagnosing ear, nose, and throat conditions. Provide symptoms, age, gender, and medical history."
);

export const PsychiatryExpertTool = createDiagnosisTool(
    psycoAgent,
    "psychiatry_Agent",
    "Use this agent for diagnosing mental health conditions. Provide symptoms, age, gender, and medical history."
);

export const PediatricsExpertTool = createDiagnosisTool(
    pediaAgent,
    "pediatrics_Agent",
    "Use this agent for diagnosing children's health conditions. Provide symptoms, age, gender, and medical history."
);
