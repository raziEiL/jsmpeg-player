export default class WSSource {
  constructor(options) {
    this.options = options;
    this.socket = null;
    this.streaming = true;

    this.callbacks = { connect: [], data: [] };
    this.destination = null;

    this.reconnectInterval =
      // eslint-disable-next-line no-undefined
      options.reconnectInterval !== undefined ? options.reconnectInterval : 5;
    this.shouldAttemptReconnect = !!this.reconnectInterval;

    this.completed = false;
    this.established = false;
    this.progress = 0;

    this.reconnectTimeoutId = 0;

    this.onEstablishedCallback = options.onSourceEstablished;
    this.onCompletedCallback = options.onSourceCompleted; // Never used
    this.started = false;

    if (options.hookOnEstablished) {
      this.hookOnEstablished = options.hookOnEstablished;
    }
  }

  connect(destination) {
    this.destination = destination;
  }
  // eslint-disable-next-line class-methods-use-this
  destroy() {
    /*     clearTimeout(this.reconnectTimeoutId);
        this.shouldAttemptReconnect = false;
        this.socket.close(); */
  }

  start() {
    this.shouldAttemptReconnect = !!this.reconnectInterval;
    this.progress = 1;
    this.established = false;
    this.started = true;

    /*     this.socket = new WebSocket(this.url, this.options.protocols || null);
        this.socket.binaryType = 'arraybuffer';
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onerror = this.onClose.bind(this);
        this.socket.onclose = this.onClose.bind(this); */
  }

  // eslint-disable-next-line class-methods-use-this
  resume() {
    // Nothing to do here
  }

  onOpen() {
    this.progress = 1;
  }
  // eslint-disable-next-line class-methods-use-this
  onClose() {
    /*     if (this.shouldAttemptReconnect) {
          clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = setTimeout(() => {
            this.start();
          }, this.reconnectInterval * 1000);
        } */
  }

  onMessage(ev) {
    if (!this.started) return;
    const isFirstChunk = !this.established;
    this.established = true;

    if (isFirstChunk && this.hookOnEstablished) {
      this.hookOnEstablished();
    }

    if (isFirstChunk && this.onEstablishedCallback) {
      this.onEstablishedCallback(this);
    }

    if (this.destination) {
      this.destination.write(ev.data ? ev.data : ev);
    }
  }
}
