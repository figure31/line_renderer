async function loadImages() {
    const rpcUrl = 'https://sepolia.optimism.io';
    const web3 = new Web3(rpcUrl);
    const contractAddress = '0x15BE1883Bad14cEB981aa37116a007c6fc81037e';
    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"getAllImagePoints","outputs":[{"components":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"internalType":"struct DynamicImageContract.Point[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllOriginPoints","outputs":[{"components":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"internalType":"struct DynamicImageContract.Point[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getImageUrl","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"name":"moveOriginPoint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"name":"setImagePoint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"internalType":"struct DynamicImageContract.Point[]","name":"points","type":"tuple[]"}],"name":"sumUpImages","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_baseImageUrl","type":"string"}],"name":"updateBaseImageUrl","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        const imageUrls = await contract.methods.getImageUrl().call();
        displayImages(imageUrls);
        await displayPoints(contract);
    } catch (error) {
        console.error('Error fetching images:', error);
    }

    document.getElementById('gridToggle').addEventListener('click', function() {
        const grid = document.getElementById('grid');
        const imagesContainer = document.getElementById('images');
        const isGridVisible = grid.style.display === 'flex'; // Check if the grid is currently visible
    
        grid.style.display = isGridVisible ? 'none' : 'flex'; // Toggle grid visibility
        imagesContainer.style.display = isGridVisible ? 'flex' : 'none'; // Toggle images visibility
    
        // Optionally, to prevent a slight shift due to the scrollbar appearance/disappearance:
        document.body.style.overflow = isGridVisible ? 'auto' : 'hidden'; // Hide overflow when grid is visible
    });
}

function displayImages(imageUrls) {
    const container = document.getElementById('images');
    container.innerHTML = ''; // Clear existing content

    imageUrls.split(',').forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        container.appendChild(img);
    });
}

function generateGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear existing grid content
    grid.style.display = 'flex'; // Make sure the grid container is a flexbox
    grid.style.flexDirection = 'column-reverse'; // Reverse the column order to match Cartesian coordinates

    // Generate rows from top to bottom, which will be bottom to top in Cartesian coordinates
    for (let y = 0; y < 5; y++) {
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.style.display = 'flex'; // Ensure the row is a flex container
        row.style.flexDirection = 'row'; // Ensure the dots are laid out in a row

        for (let x = 0; x < 5; x++) {
            const dot = document.createElement('div');
            dot.className = 'grid-dot';
            dot.textContent = '•'; // Using a bullet point as a placeholder for the dot
            dot.style.display = 'flex'; // Make each dot a flex container
            dot.style.alignItems = 'center'; // Center content vertically
            dot.style.justifyContent = 'center'; // Center content horizontally
            dot.style.width = '20px';
            dot.style.height = '20px';
            dot.style.margin = '3vw'; // Adjust the space between dots
            dot.dataset.x = x;
            dot.dataset.y = y;
            row.appendChild(dot); // Append the dot to the row
        }
        grid.appendChild(row); // Append the row to the grid
    }
}



async function displayPoints(contract) {
    const originPoints = await contract.methods.getAllOriginPoints().call();
    const imagePoints = await contract.methods.getAllImagePoints().call();

    // Create a set of strings for all previous points for quick lookup
    let prevOriginPoints = new Set(originPoints.slice(0, -1).map(p => `${p.x},${p.y}`));
    let prevImagePoints = new Set(imagePoints.slice(0, -1).map(p => `${p.x},${p.y}`));

    // Mark all points with their respective symbols
    originPoints.forEach((point, index) => {
        let symbol = prevOriginPoints.has(`${point.x},${point.y}`) ? '@' : 'o';
        // If it's the last point and not marked previously as '@', mark as 'o'
        if (index === originPoints.length - 1 && symbol !== '@') {
            symbol = 'o';
        }
        markPoint(point, symbol);
    });

    imagePoints.forEach((point, index) => {
        let symbol = prevImagePoints.has(`${point.x},${point.y}`) ? '#' : 'x';
        // If it's the last point and not marked previously as '#', mark as 'x'
        if (index === imagePoints.length - 1 && symbol !== '#') {
            symbol = 'x';
        }
        markPoint(point, symbol);
    });

    // Correct any points that should be marked as '&'
    prevOriginPoints.forEach(key => {
        if (prevImagePoints.has(key)) {
            let [x, y] = key.split(',').map(Number);
            markPoint({ x, y }, '&');
        }
    });
}

function markPoint(point, mark) {
    const dots = document.getElementsByClassName('grid-dot');
    Array.from(dots).forEach(dot => {
        if (dot.dataset.x == point.x && dot.dataset.y == point.y) {
            dot.textContent = mark; // Set the symbol
            dot.classList.add('symbol'); // Add the symbol class to change the size
        }
    });
}

window.onload = function() {
    loadImages(); // Call your load images function
    generateGrid();
    document.getElementById('grid').style.display = 'none'; // Ensure the grid is hidden on load
};