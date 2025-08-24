import { useState, useEffect } from 'react';
import { getLocalModels } from '../api/ollama';
import { getCloudModels } from '../api/cloudModels';

export const useUnifiedModels = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllModels = async () => {
      setIsLoading(true);

      // Fetch in parallel
      const [localModels, cloudModels] = await Promise.all([
        getLocalModels(),
        getCloudModels(),
      ]);

      // Format and combine the lists
      const formattedLocal = localModels.map(m => ({
        id: `local-${m.name}`,
        name: `Ollama: ${m.name}`,
        group: 'Local Models (Ollama)',
      }));

      const formattedCloud = cloudModels.map(m => ({
        id: `cloud-${m.id}`,
        name: m.name,
        group: `Cloud Models (${m.provider})`,
      }));

      // Group for the <select> element
      const groupedModels = [
        {
          label: 'Local Models (Ollama)',
          options: formattedLocal,
        },
        {
          label: 'Cloud Models (OpenAI)',
          options: formattedCloud.filter(m => m.group.includes('OpenAI')),
        },
        {
            label: 'Cloud Models (Anthropic)',
            options: formattedCloud.filter(m => m.group.includes('Anthropic')),
        },
        {
            label: 'Cloud Models (Google)',
            options: formattedCloud.filter(m => m.group.includes('Google')),
        },
      ];

      setModels(groupedModels);
      setIsLoading(false);
    };

    fetchAllModels();
  }, []);

  return { models, isLoading };
};
