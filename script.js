document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('meshGlobe');
    const ctx = canvas.getContext('2d');
    const logPipe = document.getElementById('logPipe');
    const agentMetric = document.getElementById('agentMetric');
    const syncMetric = document.getElementById('syncMetric');
    const meshId = document.getElementById('meshId');
    const meshLat = document.getElementById('meshLat');
    const projectTabs = document.querySelectorAll('.project-tab');

    // 1. Mesh State & 3D Math
    let points = [];
    const numPoints = 120;
    const radius = 180;
    let rotationX = 0;
    let rotationY = 0;

    class Point3D {
        constructor(id) {
            this.id = id;
            this.phi = Math.acos(-1 + (2 * id) / numPoints);
            this.theta = Math.sqrt(numPoints * Math.PI) * this.phi;
            this.x = radius * Math.sin(this.phi) * Math.cos(this.theta);
            this.y = radius * Math.sin(this.phi) * Math.sin(this.theta);
            this.z = radius * Math.cos(this.phi);
            this.isActive = Math.random() > 0.9;
        }

        project(ctx, w, h) {
            const radX = rotationX;
            const radY = rotationY;
            
            // Rotation Y
            let x1 = this.x * Math.cos(radY) - this.z * Math.sin(radY);
            let z1 = this.x * Math.sin(radY) + this.z * Math.cos(radY);
            
            // Rotation X
            let y2 = this.y * Math.cos(radX) - z1 * Math.sin(radX);
            let z2 = this.y * Math.sin(radX) + z1 * Math.cos(radX);

            const scale = 500 / (500 + z2);
            const px = x1 * scale + w / 2;
            const py = y2 * scale + h / 2;

            if (z2 > 0) return; // Cull back-face

            ctx.beginPath();
            ctx.arc(px, py, this.isActive ? 4 : 2, 0, Math.PI * 2);
            ctx.fillStyle = this.isActive ? '#4f46e5' : '#cbd5e1';
            ctx.fill();

            // Connections (Simple mesh logic)
            points.forEach(p => {
                const dx = this.id - p.id;
                if (dx > 0 && dx < 4) {
                    const dist = Math.sqrt((this.x-p.x)**2 + (this.y-p.y)**2 + (this.z-p.z)**2);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        // p.project for line context is complex, we just use local draw
                    }
                }
            });
        }
    }

    // Initialize Points
    for (let i = 0; i < numPoints; i++) {
        points.push(new Point3D(i));
    }

    const renderMesh = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        rotationY += 0.005;
        rotationX += 0.002;

        const w = canvas.width;
        const h = canvas.height;

        // Draw mesh lines first for better look
        points.forEach(p => p.project(ctx, w, h));

        requestAnimationFrame(renderMesh);
    };

    // 2. Orchestration Logic & Logging
    const projectPings = [
        "Bio-Matrix: Identity integrity verified",
        "Agent-Alpha: Neural decision loop stable",
        "Neural-Forge: 512 parameters optimized",
        "Vector-Voyage: RAG traversal complete",
        "Logic-Forge: Deduction path 0x4f valid",
        "Ghostwriter: Content SEO health 98%",
        "Sentinel-Hub: DDoS mitigation passive",
        "Flow-Sync: 12.4k packets synchronized",
        "Cloud-Core: 8 instance nodes operational"
    ];

    const addLog = (msg, isPrime = false) => {
        const entry = document.createElement('div');
        entry.className = `log-entry ${isPrime ? 'prime' : ''}`;
        entry.innerHTML = `[${new Date().toLocaleTimeString('en-GB')}] ${msg}`;
        logPipe.prepend(entry);
        if (logPipe.children.length > 20) logPipe.lastChild.remove();
    };

    const updateMetrics = () => {
        const agents = 40 + Math.floor(Math.random() * 5);
        const syncs = (1.2 + Math.random() * 0.4).toFixed(1);
        
        agentMetric.innerText = agents;
        syncMetric.innerText = `${syncs}k`;
        
        if (Math.random() > 0.7) {
            const msg = projectPings[Math.floor(Math.random() * projectPings.length)];
            addLog(msg);
        }

        meshLat.innerText = `${(Math.random() * 2 + 0.5).toFixed(1)}ms`;
    };

    // 3. User Interaction
    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            projectTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const name = tab.querySelector('.name').innerText;
            meshId.innerText = `PRJ-${name.slice(0, 3).toUpperCase()}`;
            addLog(`HANDSHAKE: Focusing Nexus Core on ${name}`, true);
        });
    });

    // 4. Initialization
    setInterval(updateMetrics, 2000);
    renderMesh();
    addLog("Nexus-Prime Orchestrator Online.", true);
    addLog("Executing Enterprise Synthesis protocol...");
});
