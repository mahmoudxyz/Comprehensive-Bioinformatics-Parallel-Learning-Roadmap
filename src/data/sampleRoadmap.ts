import { RoadmapData } from '@/types/roadmap';

export const initialRoadmapData: RoadmapData = {
  title: "Comprehensive Bioinformatics Parallel Learning Roadmap",
  description: "A strategic parallel learning methodology where you develop multiple competencies simultaneously through integrated projects of increasing complexity",
  milestones: [
    {
      id: "m1",
      title: "Programming Fundamentals",
      description: "Master essential programming skills for bioinformatics data processing and analysis",
      isExpanded: true,
      resources: [
        {
          id: "r1",
          title: "Python Basics",
          description: "Master fundamental Python concepts essential for bioinformatics, including variables, data types, control structures, functions, and file I/O operations",
          url: "https://pythonforbiologists.com/",
          type: "book",
          difficulty: "beginner",
          tags: ["python", "programming", "basics"],
          completed: false,
          favorite: false
        },
        {
          id: "r2",
          title: "Data Structures and Algorithms",
          description: "Learn efficient ways to store and process biological data, focusing on algorithms specifically designed for sequence analysis and pattern matching",
          url: "https://www.coursera.org/learn/algorithms-for-dna-sequencing",
          type: "course",
          difficulty: "intermediate",
          tags: ["algorithms", "data structures", "sequence analysis"],
          completed: false,
          favorite: false
        },
        {
          id: "r3",
          title: "Biopython Library",
          description: "Leverage the powerful Biopython library to streamline common bioinformatics tasks, from sequence manipulation to interaction with biological databases",
          url: "https://biopython.org/wiki/Documentation",
          type: "documentation",
          difficulty: "intermediate",
          tags: ["biopython", "libraries", "sequence analysis"],
          completed: false,
          favorite: false
        }
      ]
    },
    {
      id: "m2",
      title: "Molecular Biology Essentials",
      description: "Understand the biological fundamentals needed to interpret computational results",
      isExpanded: false,
      resources: [
        {
          id: "r4",
          title: "Central Dogma and Genetic Code",
          description: "Understand the fundamental processes of DNA replication, transcription, and translation that form the central dogma of molecular biology",
          url: "https://www.edx.org/course/introduction-to-biology-the-secret-of-life",
          type: "course",
          difficulty: "beginner",
          tags: ["molecular biology", "DNA", "RNA", "proteins"],
          completed: false,
          favorite: false
        },
        {
          id: "r5",
          title: "Genome Organization and Elements",
          description: "Explore the structure and organization of genomes, including protein-coding genes, regulatory elements, and non-coding regions",
          url: "https://www.coursera.org/learn/genomic-data-science",
          type: "course",
          difficulty: "intermediate", 
          tags: ["genomics", "gene structure", "regulatory elements"],
          completed: false,
          favorite: false
        },
        {
          id: "r6",
          title: "Mutations and Genetic Variation",
          description: "Study the types and consequences of genetic mutations that lead to variation within and between species",
          url: "https://www.coursera.org/learn/introduction-to-human-genetics",
          type: "course",
          difficulty: "intermediate",
          tags: ["mutations", "genetic variation", "population genetics"],
          completed: false,
          favorite: false
        }
      ]
    },
    {
      id: "m3",
      title: "Bioinformatics Tools",
      description: "Learn essential bioinformatics software and databases used in the field",
      isExpanded: false,
      resources: [
        {
          id: "r7",
          title: "Command Line and Unix",
          description: "Master the Unix command-line environment which forms the backbone of bioinformatics data processing",
          url: "https://www.coursera.org/learn/unix",
          type: "course",
          difficulty: "beginner",
          tags: ["unix", "command line", "bash"],
          completed: false,
          favorite: false
        },
        {
          id: "r8",
          title: "BLAST and Sequence Similarity",
          description: "Learn to use the Basic Local Alignment Search Tool (BLAST) and understand the algorithms behind sequence similarity searches",
          url: "https://www.ncbi.nlm.nih.gov/books/NBK569839/",
          type: "documentation",
          difficulty: "intermediate",
          tags: ["BLAST", "sequence similarity", "alignment"],
          completed: false,
          favorite: false
        },
        {
          id: "r9",
          title: "Biological Databases",
          description: "Explore the major biological databases that serve as repositories for sequences, structures, and annotations",
          url: "https://www.ncbi.nlm.nih.gov/",
          type: "database",
          difficulty: "intermediate",
          tags: ["databases", "GenBank", "NCBI", "UniProt"],
          completed: false,
          favorite: false
        }
      ]
    },
    {
      id: "m4",
      title: "Statistical Foundations",
      description: "Develop statistical analysis skills for interpreting biological data",
      isExpanded: false,
      resources: [
        {
          id: "r10",
          title: "Descriptive Statistics for Biological Data",
          description: "Learn to summarize and describe biological datasets using statistical measures",
          url: "https://www.edx.org/course/statistics-and-r-for-the-life-sciences",
          type: "course",
          difficulty: "beginner",
          tags: ["statistics", "R", "data analysis"],
          completed: false,
          favorite: false
        },
        {
          id: "r11",
          title: "Hypothesis Testing",
          description: "Master the principles of statistical hypothesis testing as applied to biological questions",
          url: "https://www.coursera.org/learn/statistical-inference",
          type: "course",
          difficulty: "intermediate",
          tags: ["hypothesis testing", "p-values", "statistical tests"],
          completed: false,
          favorite: false
        },
        {
          id: "r12",
          title: "Sequence Statistics and Complexity",
          description: "Explore statistical methods specifically designed for analyzing biological sequences",
          url: "https://www.amazon.com/Biological-Sequence-Analysis-Probabilistic-Proteins/dp/0521629713",
          type: "book",
          difficulty: "advanced",
          tags: ["sequence analysis", "complexity measures", "Markov models"],
          completed: false,
          favorite: false
        }
      ]
    },
    {
      id: "m5",
      title: "Phase 1 Milestone Project",
      description: "Integrate skills from all previous modules into a complete analytical pipeline",
      isExpanded: false,
      resources: [
        {
          id: "r13",
          title: "ORF Finder and Sequence Analysis Pipeline",
          description: "Create a complete Python program that analyzes DNA sequences to identify open reading frames, compute sequence statistics, and perform similarity searches using BLAST",
          url: "https://github.com/your-username/orf-analysis-pipeline",
          type: "project",
          difficulty: "advanced",
          tags: ["pipeline", "ORF", "sequence analysis", "BLAST", "visualization"],
          completed: false,
          favorite: false
        }
      ]
    }
  ]
};