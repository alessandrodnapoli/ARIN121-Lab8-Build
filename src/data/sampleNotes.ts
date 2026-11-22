export interface SampleNote {
  id: string;
  topic: string;
  category: string;
  icon: string;
  text: string;
}

export const SAMPLE_STUDY_MATERIALS: SampleNote[] = [
  {
    id: 'bio',
    topic: 'Cellular Respiration & ATP Synthesis',
    category: 'Biology',
    icon: '🧬',
    text: `Cellular respiration is the biochemical pathway through which cells break down glucose to generate ATP (adenosine triphosphate). It consists of three primary stages: glycolysis, the Krebs cycle (citric acid cycle), and oxidative phosphorylation via the electron transport chain.

Glycolysis occurs in the cytoplasm and does not require oxygen (anaerobic). During glycolysis, one 6-carbon glucose molecule is cleaved into two 3-carbon pyruvate molecules, producing a net yield of 2 ATP and 2 NADH molecules.

When oxygen is present, pyruvate is transported into the mitochondrial matrix and converted into acetyl-CoA by the pyruvate dehydrogenase complex, releasing carbon dioxide. Acetyl-CoA enters the Krebs cycle, which completes the breakdown of glucose derivatives, generating 2 ATP, 6 NADH, and 2 FADH2 per glucose molecule.

The final stage, oxidative phosphorylation, occurs across the inner mitochondrial membrane. NADH and FADH2 donate electrons to the electron transport chain. As electrons pass through protein complexes I-IV, protons (H+) are pumped into the intermembrane space, creating a steep electrochemical proton gradient. Protons flow back into the matrix through ATP synthase via chemiosmosis, producing approximately 28 to 32 ATP molecules. Oxygen serves as the final electron acceptor, combining with protons to form water (H2O). Without oxygen, the electron transport chain halts, and cells must rely on fermentation to regenerate NAD+.`
  },
  {
    id: 'hist',
    topic: 'The First Industrial Revolution',
    category: 'History',
    icon: '🏛️',
    text: `The First Industrial Revolution began in Great Britain during the mid-to-late 18th century (roughly 1760 to 1840) and transformed agrarian societies into industrialized manufacturing economies. Several geographic and economic advantages positioned Britain at the forefront: abundant coal and iron ore deposits, capital accumulation from colonial trade, a stable parliamentary government with established property rights, and an expanding network of navigable rivers and canals.

The textile industry was the primary catalyst of industrialization. Innovations such as James Hargreaves's Spinning Jenny (1764) and Richard Arkwright's water frame (1769) drastically increased yarn production speed. James Watt's improvements to the Newcomen steam engine in 1776 separated condensation from the main cylinder, radically improving fuel efficiency and freeing factories from their geographic reliance on rapid water streams.

Socially, industrialization sparked rapid urbanization. Cities like Manchester and Birmingham expanded rapidly without adequate infrastructure, leading to overcrowding, poor sanitation, and high disease rates. Labor was characterized by long workdays (often 12–16 hours), harsh factory discipline, and widespread employment of women and young children. In response, social movements emerged, including the Luddites who resisted mechanical looms, and later labor reform coalitions that prompted the British Factory Act of 1833, which placed initial limits on child labor hours in textile mills.`
  },
  {
    id: 'cs',
    topic: 'Algorithm Analysis & Big-O Notation',
    category: 'Computer Science',
    icon: '💻',
    text: `Algorithm analysis provides a mathematical framework for quantifying the computational efficiency of algorithms independently of specific hardware or programming language implementations. The primary metric is asymptotic time and space complexity, expressed using Big-O notation, which characterizes the upper bound of resource growth as input size n approaches infinity.

Key complexity classes from fastest to slowest include:
- O(1) Constant Time: Operations that execute in fixed time regardless of input size, such as array indexing by index or inserting into a hash map without hash collisions.
- O(log n) Logarithmic Time: Algorithms that divide the search space in half at each iteration, typified by Binary Search on a sorted array.
- O(n) Linear Time: Single-pass traversals where work scales proportionally with n, such as linear search or finding the maximum element in an unsorted list.
- O(n log n) Linearithmic Time: The optimal comparison-based sorting bound achieved by Merge Sort and Heap Sort. Merge Sort uses a divide-and-conquer paradigm with guaranteed O(n log n) performance across best, average, and worst cases, though it requires O(n) auxiliary memory.
- O(n^2) Quadratic Time: Nested loops over the input, seen in naive sorting algorithms like Bubble Sort and Selection Sort.
- O(2^n) Exponential Time: Algorithms whose runtime doubles with each incremental addition to n, typical in brute-force recursive solutions to combinatorial problems like the Traveling Salesperson Problem or generating all subsets.

When analyzing algorithms, the worst-case time complexity is standard because it guarantees performance limits. Space complexity measures the auxiliary memory an algorithm allocates during execution, excluding the memory of the input itself.`
  },
  {
    id: 'econ',
    topic: 'Supply, Demand, and Price Elasticity',
    category: 'Economics',
    icon: '📈',
    text: `Microeconomics analyzes how individual economic agents allocate scarce resources. The cornerstone model is the law of supply and demand in a competitive market. The law of demand states that, ceteris paribus (all other factors held constant), as the price of a good rises, the quantity demanded falls, resulting in a downward-sloping demand curve due to the substitution effect and income effect. Conversely, the law of supply states that as price rises, suppliers are willing to produce a higher quantity, creating an upward-sloping supply curve.

Market equilibrium occurs at the intersection of supply and demand curves, where quantity supplied equals quantity demanded, establishing the market-clearing equilibrium price and quantity. If price is above equilibrium, an excess supply (surplus) occurs, putting downward pressure on prices. If price is below equilibrium, excess demand (shortage) occurs, driving prices upward.

Price Elasticity of Demand (PED) measures the responsiveness of quantity demanded to a percentage change in price, calculated as (% change in Q) / (% change in P). 
- If |PED| > 1, demand is elastic; consumers are sensitive to price changes, and a price increase will reduce total revenue.
- If |PED| < 1, demand is inelastic; consumers have few close substitutes or the good is a necessity (e.g., insulin), meaning price hikes increase total revenue.
- If |PED| = 1, demand is unit elastic, where total revenue remains constant when price changes. Determinants of elasticity include availability of close substitutes, proportion of income spent on the good, and time horizon allowed for adjustment.`
  }
];
