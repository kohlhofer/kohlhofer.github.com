class ShaderBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        document.body.prepend(this.canvas);

        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        // Generate random seed
        this.generateNewSeed();
        
        this.init();
    }

    generateNewSeed() {
        this.seed = Math.random();
    }

    async init() {
        // Load shaders
        const [vertexShader, fragmentShader] = await Promise.all([
            this.loadShader('background.vert', this.gl.VERTEX_SHADER),
            this.loadShader('background.frag', this.gl.FRAGMENT_SHADER)
        ]);

        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize shader program:', this.gl.getProgramInfoLog(this.program));
            return;
        }

        // Get attribute locations
        this.positionLocation = this.gl.getAttribLocation(this.program, 'position');
        this.uvLocation = this.gl.getAttribLocation(this.program, 'uv');

        // Get uniform locations
        this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
        this.mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
        this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.seedLocation = this.gl.getUniformLocation(this.program, 'u_seed');

        // Set up event listeners
        this.setupEventListeners();

        // Create buffers
        this.positionBuffer = this.gl.createBuffer();
        this.uvBuffer = this.gl.createBuffer();

        // Set up geometry
        const positions = new Float32Array([
            -1, -1, 0,
            1, -1, 0,
            -1, 1, 0,
            1, 1, 0
        ]);

        const uvs = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, uvs, this.gl.STATIC_DRAW);

        // Start animation
        this.startTime = performance.now();
        this.render();
    }

    setupEventListeners() {
        // Set up mouse tracking
        this.mouse = { x: 0.5, y: 0.5 };
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Set up click handler for the entire page
        window.addEventListener('click', () => {
            this.generateNewSeed();
            // Reset animation time to make transition smoother
            this.startTime = performance.now();
        });
        
        this.handleResize();
    }

    async loadShader(url, type) {
        const response = await fetch(url);
        const source = await response.text();
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = (event.clientX - rect.left) / rect.width;
        this.mouse.y = 1.0 - (event.clientY - rect.top) / rect.height;
    }

    handleResize() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    render() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        // Update uniforms
        const time = (performance.now() - this.startTime) * 0.001;
        this.gl.uniform1f(this.timeLocation, time);
        this.gl.uniform1f(this.seedLocation, this.seed);
        this.gl.uniform2f(this.mouseLocation, this.mouse.x, this.mouse.y);
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);

        // Bind UV buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.enableVertexAttribArray(this.uvLocation);
        this.gl.vertexAttribPointer(this.uvLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(this.render.bind(this));
    }
}

// Initialize the shader background
new ShaderBackground(); 