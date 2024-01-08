async function loadImages() {
    // Change to Optimism Mainnet RPC URL
    const rpcUrl = 'https://mainnet.optimism.io';
    const web3 = new Web3(rpcUrl);

    // Update with your mainnet contract address
    const contractAddress = '0x9C06088A110dECEB4FE0FA6698787Ff218ca379B';

    // Update with your new ABI
    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"getAllImagePoints","outputs":[{"components":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"internalType":"struct LineRenderer.Point[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllOriginPoints","outputs":[{"components":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"internalType":"struct LineRenderer.Point[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getImageUrl","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"name":"moveOriginPoint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"name":"setImagePoint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"internalType":"struct LineRenderer.Point[]","name":"points","type":"tuple[]"}],"name":"sumUpImages","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_baseImageUrl","type":"string"}],"name":"updateBaseImageUrl","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        const imageUrls = await contract.methods.getImageUrl().call();
        displayImages(imageUrls);
    } catch (error) {
        console.error('Error fetching images:', error);
    }
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

window.onload = loadImages;
