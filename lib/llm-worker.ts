import { pipeline, env, TextStreamer } from "@huggingface/transformers";

// Configure transformers.js for web
env.allowLocalModels = false;
env.useBrowserCache = true;

class LLMPipeline {
  static task = "text-generation";
  static model = "HuggingFaceTB/SmolLM-360M-Instruct";
  static instance: any = null;

  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
        device: "webgpu"
      });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  const { type, data } = event.data;

  if (type === "init") {
    try {
      // Preload the model
      await LLMPipeline.getInstance((progress: any) => {
        self.postMessage({
          type: "progress",
          data: progress,
        });
      });

      // Send ready signal
      self.postMessage({
        type: "ready",
      });
    } catch (error: any) {
      self.postMessage({
        type: "error",
        data: error.message,
      });
    }
  } else if (type === "generate") {
    try {
      // Get the pipeline instance
      const generator = await LLMPipeline.getInstance((progress: any) => {
        // Send progress updates back to main thread
        self.postMessage({
          type: "progress",
          data: progress,
        });
      });

      // Create text streamer with callback
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        callback_function: (text: string) => {
          // Send streaming updates back to main thread
          self.postMessage({
            type: "stream",
            data: text,
          });
        },
      });

      // Generate response
      console.log(`talking to the LLM now. messages is ${data.messages}`);
      const output = await generator(data.messages, {
        max_new_tokens: data.max_new_tokens || 2048,
        do_sample: false,
        streamer,
      });
      console.log('llm replied back');
      const response = output[0].generated_text.at(-1).content;
      debugger;
      // Send final result back to main thread
      self.postMessage({
        type: "complete",
        data: response,
      });
    } catch (error: any) {
      self.postMessage({
        type: "error",
        data: error.message,
      });
    }
  }
});

export {};
