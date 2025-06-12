function netscope() {
    return {
        subnet: localStorage.getItem('netscope-subnet') || '192.168.1',
        hosts: [],
        darkMode: localStorage.getItem('netscope-dark') === 'true',
        init() {
            if (this.darkMode) document.documentElement.classList.add('dark');
        },
        toggleDark() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('netscope-dark', this.darkMode);
            document.documentElement.classList.toggle('dark', this.darkMode);
        },
        scan() {
            localStorage.setItem('netscope-subnet', this.subnet);
            this.hosts = [];
            for (let i = 1; i <= 254; i++) {
                const ip = `${this.subnet}.${i}`;
                const host = { ip, status: 'pending', note: localStorage.getItem('note-' + ip) || '' };
                this.hosts.push(host);
                this.pingHost(host);
            }
        },
        pingHost(host) {
            const img = new Image();
            const timeout = setTimeout(() => {
                host.status = 'offline';
            }, 3000);
            img.onload = () => {
                clearTimeout(timeout);
                host.status = 'online';
            };
            img.onerror = () => {
                clearTimeout(timeout);
                host.status = 'offline';
            };
            img.src = `http://${host.ip}/favicon.ico?` + Date.now();
        },
        saveNote(host) {
            localStorage.setItem('note-' + host.ip, host.note);
        },
        exportCSV() {
            const header = ['IP Address','Status','Note'];
            const rows = this.hosts.map(h => [h.ip, h.status, h.note]);
            let csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].map(e => e.join(',')).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'netscope.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
