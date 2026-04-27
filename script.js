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
            
            // 3D Rotation
            let x1 = this.x * Math.cos(radY) - this.z * Math.sin(radY);
            let z1 = this.x * Math.sin(radY) + this.z * Math.cos(radY);
            let y2 = this.y * Math.cos(radX) - z1 * Math.sin(radX);
            let z2 = this.y * Math.sin(radX) + z1 * Math.cos(radX);

            const scale = 600 / (600 + z2);
            const px = x1 * scale + w / 2;
            const py = y2 * scale + h / 2;

            if (z2 > 20) return null; // Backface culling

            return { px, py, isActive: this.isActive, z: z2 };
        }
    }

    // Initialize Points
    for (let i = 0; i < numPoints; i++) {
        points.push(new Point3D(i));
    }

    const renderMesh = () => {
        const container = canvas.parentElement;
        if (!container) return;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        rotationY += 0.003;
        rotationX += 0.001;

        const w = canvas.width;
        const h = canvas.height;

        const projected = points.map(p => p.project(ctx, w, h)).filter(p => p !== null);

        // Draw Interconnects
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
        for (let i = 0; i < projected.length; i++) {
            for (let j = i + 1; j < Math.min(i + 5, projected.length); j++) {
                ctx.moveTo(projected[i].px, projected[i].py);
                ctx.lineTo(projected[j].px, projected[j].py);
            }
        }
        ctx.stroke();

        // Draw Nodes
        projected.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.px, p.py, p.isActive ? 3 : 1.5, 0, Math.PI * 2);
            ctx.fillStyle = p.isActive ? '#4f46e5' : '#94a3b8';
            ctx.fill();
            if (p.isActive) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#4f46e5';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

        requestAnimationFrame(renderMesh);
    };

    // 2. Orchestration Logic & Logging
    const projectPings = [
        "Nexus-Prime: Global mesh integrity 100%",
        "Agent-Alpha: Neural decision loop stable",
        "Neural-Lens: 512 parameters optimized",
        "Aether-V: Spatial telemetry synced",
        "Logic-Forge: Deduction path 0x4f valid",
        "Ghostwriter: Content SEO health 98%",
        "Cloud-Core: 8 instance nodes operational",
        "Flow-Sync: 12.4k packets synchronized"
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

    // 3. View Switching Logic
    const views = {
        overview: document.getElementById('overviewView'),
        infrastructure: document.getElementById('infrastructureView'),
        agents: document.getElementById('agentsView'),
        security: document.getElementById('securityView')
    };

    const switchView = (viewName) => {
        Object.values(views).forEach(v => v.classList.remove('active'));
        if (views[viewName]) {
            views[viewName].classList.add('active');
            addLog(`VIEW_ENGINE: Engaging ${viewName.toUpperCase()} module`, true);
        }
    };

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchView(btn.getAttribute('data-view'));
        });
    });

    // 4. User Interaction
    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            projectTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const name = tab.querySelector('.name').innerText;
            meshId.innerText = `PRJ-${name.slice(0, 3).toUpperCase()}`;
            addLog(`HANDSHAKE: Focusing Nexus Core on ${name}`, true);
            
            // Visual Ping (Temporary speed up)
            rotationY += 2;
        });
    });

    // 5. Initialization
    setInterval(updateMetrics, 2000);
    renderMesh();
    addLog("Nexus-Prime Orchestrator Online.", true);
    addLog("Executing Enterprise Synthesis protocol...");
});
