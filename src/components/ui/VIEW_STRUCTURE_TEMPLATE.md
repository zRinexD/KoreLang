/**
 * VIEW STRUCTURE TEMPLATE
 * ========================
 * 
 * Tous les nouvelles vues devraient suivre cette structure standard.
 * Cela garantit une cohérence visuelle et fonctionnelle.
 * 
 * STRUCTURE DE BASE:
 * 
 * import { ViewLayout } from './ui';
 * 
 * export const MyView: React.FC<MyViewProps> = ({ ... }) => {
 *   const { t } = useTranslation();
 * 
 *   return (
 *     <ViewLayout
 *       icon={IconName}
 *       title={t('view.title')}
 *       subtitle={t('view.subtitle')}
 *       headerChildren={<OptionalWidgets />}
 *     >
 *       {/* Contenu principal de la vue */}
 *     </ViewLayout>
 *   );
 * };
 * 
 * ========================
 * EXEMPLES D'IMPLÉMENTATION:
 * ========================
 */

// EXEMPLE 1: Vue simple avec contrôles
/*
import { ViewLayout } from './ui';
import { BookOpen } from 'lucide-react';

export const SimpleView = () => {
  return (
    <ViewLayout
      icon={BookOpen}
      title="Mon Livre"
      subtitle="Gestion des contenu"
      headerChildren={
        <div className="flex gap-2">
          <button>Ajouter</button>
          <button>Supprimer</button>
        </div>
      }
    >
      <div className="p-6 space-y-4">
        {/* Contenu ici */}
      </div>
    </ViewLayout>
  );
};
*/

// EXEMPLE 2: Vue avec layout personnalisé
/*
import { ViewLayout } from './ui';
import { Settings } from 'lucide-react';

export const SettingsView = () => {
  return (
    <ViewLayout
      icon={Settings}
      title="Paramètres"
      subtitle="Configurez votre application"
    >
      <div className="p-6 max-w-4xl">
        <div className="grid grid-cols-2 gap-6">
          <div>{/* Sidebar */}</div>
          <div>{/* Contenu */}</div>
        </div>
      </div>
    </ViewLayout>
  );
};
*/

// EXEMPLE 3: Vue type Dashboard (avec titleContent personnalisé)
/*
import { ViewHeader } from './ui';
import { Building2 } from 'lucide-react';

export const Dashboard = () => {
  const displayProjectName = "Mon Projet";
  const displayAuthor = "Jean Dupont";
  const totalWords = 500;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <ViewHeader
        icon={Building2}
        titleContent={
          <div className="flex justify-between items-start flex-1 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {displayProjectName}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Par <span style={{ color: 'var(--accent)' }}>{displayAuthor}</span>
              </p>
            </div>
            <StatBox value={totalWords} label="Mots" />
          </div>
        }
      />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto">
        {/* Contenu du dashboard */}
      </div>
    </div>
  );
};
*/

// ========================
// MIGRATION CHECKLIST:
// ========================
// 
// Pour migrer une vue existante vers ViewLayout:
//
// 1. ✓ Importer ViewLayout et ViewHeader
// 2. ✓ Identifier l'icône appropriée
// 3. ✓ Extraire le titre et sous-titre
// 4. ✓ Déplacer les widgets du header en headerChildren
// 5. ✓ Wrapper le contenu dans ViewLayout
// 6. ✓ Ajuster le padding/spacing du contenu
// 7. ✓ Tester l'apparence visuelle
// 8. ✓ Vérifier la scroll sur mobile
//
// BONUS: Les nouvelles vues héritent automatiquement de:
//  - ViewHeader cohérent
//  - Background theme correct
//  - Scroll comportement
//  - Responsive design
// ========================

export {};
