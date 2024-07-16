
    let allHeuristics = [];

    // Define a mapping of categories to emojis
    const categoryEmojis = {
        "Code": "💻",
        "Documentation": "📄",
        "Features": "⚙️",
        "People": "👥",
        "Process": "🔄",
        "Strategy": "🚀"  // Emoji for "Strategy"
        // Add more categories and their corresponding emojis as needed
    };

    async function fetchJSON() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/EightShapes/design-system-heuristics/main/heuristics.json');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
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
            chip.className = 'chip category-chip';
            chip.textContent = `${categoryEmojis[category]} ${category}`; // Adding emoji based on category
            chip.onclick = () => toggleFilter('category', category);
            categoryChips.appendChild(chip);
        });

        subcategories.forEach(subcategory => {
            const chip = document.createElement('div');
            chip.className = 'chip subcategory-chip';
            chip.textContent = subcategory;
            chip.onclick = () => toggleFilter('subcategory', subcategory);
            // subcategoryChips.appendChild(chip);
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
    
        // Wrapper div for category and subcategory
        const categoryWrapperDiv = document.createElement('div');
        categoryWrapperDiv.className = 'category-wrapper';
    
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.textContent = `${categoryEmojis[heuristic.category]} ${heuristic.category}`; // Adding emoji based on category
        categoryWrapperDiv.appendChild(categoryDiv);
    
        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.className = 'subcategory';
        subcategoryDiv.textContent = heuristic.subcategory;
        categoryWrapperDiv.appendChild(subcategoryDiv);
    
        heuristicDiv.appendChild(categoryWrapperDiv);
    
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
        const chipElements = type === 'category' ? document.querySelectorAll('.category-chip') : document.querySelectorAll('.subcategory-chip');
        
        const isSelected = Array.from(chipElements).find(chip => chip.textContent === `${categoryEmojis[value]} ${value}` && chip.classList.contains('selected'));
        
        for (const chip of chipElements) {
            chip.classList.remove('selected');
        }

        if (!isSelected) {
            const selectedChip = Array.from(chipElements).find(chip => chip.textContent === `${categoryEmojis[value]} ${value}`);
            if (selectedChip) {
                selectedChip.classList.add('selected');

                // If a subcategory chip is selected, also select its parent category chip
                if (type === 'subcategory') {
                    const parentCategoryChip = selectedChip.parentElement.querySelector('.category-chip');
                    if (parentCategoryChip) {
                        parentCategoryChip.classList.add('selected');
                    }
                }
            }
        }

        applyFilters();
    }

    function applyFilters() {
        const selectedCategory = Array.from(document.querySelectorAll('.category-chip')).find(chip => chip.classList.contains('selected'))?.textContent;
        const selectedSubcategory = Array.from(document.querySelectorAll('.subcategory-chip')).find(chip => chip.classList.contains('selected'))?.textContent;

        let filteredHeuristics = allHeuristics;

        if (selectedCategory) {
            const category = selectedCategory.split(' ')[1]; // Remove emoji from selected category
            filteredHeuristics = filteredHeuristics.filter(heuristic => heuristic.category === category);
        }

        if (selectedSubcategory) {
            filteredHeuristics = filteredHeuristics.filter(heuristic => heuristic.subcategory === selectedSubcategory);
        }

        displayData(filteredHeuristics);
    }

    // Fetch and display the JSON data when the page loads
    fetchJSON();

