
    let allHeuristics = [];

    async function fetchJSON() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/EightShapes/design-system-heuristics/main/heuristics.json');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data
            allHeuristics = Array.isArray(data) ? data : data.heuristics;
            populateChips(allHeuristics);
            displayData(allHeuristics);
        } catch (error) {
            console.error('Error fetching JSON data:', error);
            document.getElementById('content').textContent = 'Failed to load heuristics data.';
        }
    }

    function populateChips(heuristics) {
        const categoryChips = document.getElementById('categoryChips');
        const subcategoryChips = document.getElementById('subcategoryChips');

        const categories = new Set();
        const subcategories = new Set();

        heuristics.forEach(heuristic => {
            categories.add(heuristic.category);
            subcategories.add(heuristic.subcategory);
        });

        categories.forEach(category => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = category;
            chip.onclick = () => toggleFilter('category', category);
            categoryChips.appendChild(chip);
        });

        subcategories.forEach(subcategory => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = subcategory;
            chip.onclick = () => toggleFilter('subcategory', subcategory);
            subcategoryChips.appendChild(chip);
        });
    }

    function displayData(heuristics) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // Clear previous content

        heuristics.forEach(heuristic => {
            createHeuristicElement(contentDiv, heuristic);
        });
    }

    function createHeuristicElement(parent, heuristic) {
        const heuristicDiv = document.createElement('div');
        heuristicDiv.className = 'heuristic-card';

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.textContent = heuristic.category;
        heuristicDiv.appendChild(categoryDiv);

        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.className = 'subcategory';
        subcategoryDiv.textContent = heuristic.subcategory;
        heuristicDiv.appendChild(subcategoryDiv);

        const topicH2 = document.createElement('h2');
        topicH2.className = 'topic';
        topicH2.textContent = heuristic.topic;
        heuristicDiv.appendChild(topicH2);

        const heuristicP = document.createElement('p');
        heuristicP.className = 'heuristic';
        heuristicP.textContent = heuristic.heuristic;
        heuristicDiv.appendChild(heuristicP);

        parent.appendChild(heuristicDiv);
    }

    function toggleFilter(type, value) {
        const chipElements = type === 'category' ? document.getElementById('categoryChips').children : document.getElementById('subcategoryChips').children;
        
        const isSelected = Array.from(chipElements).find(chip => chip.textContent === value && chip.classList.contains('selected'));
        
        for (const chip of chipElements) {
            chip.classList.remove('selected');
        }

        if (!isSelected) {
            const selectedChip = Array.from(chipElements).find(chip => chip.textContent === value);
            if (selectedChip) {
                selectedChip.classList.add('selected');
            }
        }

        applyFilters();
    }

    function applyFilters() {
        const selectedCategory = Array.from(document.getElementById('categoryChips').children).find(chip => chip.classList.contains('selected'))?.textContent;
        const selectedSubcategory = Array.from(document.getElementById('subcategoryChips').children).find(chip => chip.classList.contains('selected'))?.textContent;

        let filteredHeuristics = allHeuristics;

        if (selectedCategory) {
            filteredHeuristics = filteredHeuristics.filter(heuristic => heuristic.category === selectedCategory);
        }

        if (selectedSubcategory) {
            filteredHeuristics = filteredHeuristics.filter(heuristic => heuristic.subcategory === selectedSubcategory);
        }

        displayData(filteredHeuristics);
    }

    // Fetch and display the JSON data when the page loads
    fetchJSON();

