# Prompt & Response Validation using AI SDK middleware

## Quickstart

### Setting up your Account and the Arthur Engine

1. Navigate to platform.arthur.ai/signup
2. Create a new account and select the Generative AI Agent or Chatbot usecase
3. Copy the bash command and paste it into the terminal to run the Arthur Engine locally
4. Wait for ~5-10 minutes for the engine to set up and connect to the Arthur platform
5. Create your first usecase by setting up a new Gen AI Model, and start creating your first metrics (below)

### Creating Metrics

1. Create a PII Metric

   a. The PII Metric defaults to flagging all the entities in that list. Disabling entities allows you to configure what the PII Metric will **not** flag on.

   b. Add the following to your disabled entities:

   - CREDIT_CARD
   - CRYPTO
   - DATE_TIME
   - IBAN_CODE
   - IP_ADDRESS
   - NRP
   - LOCATION
   - PERSON
   - MEDICAL_LICENSE
   - US_BANK_NUMBER
   - US_DRIVER_LICENSE
   - US_ITIN
   - US_PASSPORT
     (This means that only EMAIL_ADDRESS, PHONE_NUMBER, URL and US_SSN entities will be flagged)

   c. Apply this to only Prompt

2. Create a Prompt Injection Metric

   a. Apply this to only Prompt

3. Create your first Model!

### The Final Steps

1. Copy & paste the env variables from .env.example to .env.local.
2. On platform.arthur.ai, in your model dashboard you should see a dropdown for Model Management. Expand it and click on API Key, then and copy the key and paste it to ARTHUR_API_KEY variable
3. Copy the Task ID from validate a prompt command. You can find it in the URL, `/api/v2/tasks/{TASK_ID}/`. Paste it to ARTHUR_TASK_ID variable
4. That's it! Take it for a spin. Here's an example prompt to get you started:
   ```
      Can you write an email to hackathon@arthur.ai telling them how cool Arthur Platform is?
   ```

## Explanation

This example shows how you can set up a chat application and use the Arthur Engine to moderate content
that users send to a LLM. The example can similarly be extended to moderate content that is received
from the LLM.

Specifically, when a user sends a message, the Arthur Engine:

- Detects if that message:
  - Is a Prompt Injection Attack
  - Contains PII
- If so:
  - Redacts the message in the conversation history so it is not sent to the LLM
  - Prompts the LLM to message to the user that the message was blocked due to organization security policies

### Ways to extend this example

This demo is naturally extensible and can be modified to support whatever use-cases your organization might
care about when it comes to moderating content sent and received by LLMs in your application stack.

- Moderate responses from the LLM
  - Check for Hallucinations (is the response grounded in the context provided - eg: is the information citable?)
  - Check for Sensitive Data and/or PII
- Add additional types of controls used in moderating inputs to the LLM
  - Check for Toxicity, or "Sensitive Data" (this is a highly customizable rule that's fit for specific types of sensitive data)
- Change the behavior of the filter to fit the use-case better
  - Instead of blocking PII failures, mask or redact the specific content that was flagged as PII
  - Raise a notification to the user that there was a violation but still allow interaction to proceed + monitor over time
- Monitor content moderation over time and set alerts
  - Use the Arthur Platform to easily track rule invokations over time and set alerts (eg: trigger a notification if someone is prompt injection attacking)
