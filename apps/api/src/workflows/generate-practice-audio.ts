import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";

export class PracticeAudioGenerator extends WorkflowEntrypoint {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.do("generate listening practice audio", async () => {
      return true;
    });
  }
}
