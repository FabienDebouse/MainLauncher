# 📰 Guide : Comment ajouter des actualités

## 🎯 Vue d'ensemble

Le launcher CryoClient utilise le système RSS de Luuxis pour afficher les actualités. Voici comment ajouter de nouvelles actualités.

## 📋 Structure du système

### 1. Configuration serveur
Le fichier `config.json` sur votre serveur détermine la source des actualités :
```json
{
  "rss": "https://pokemoonx.fr/api/rss",
  "maintenance": false,
  "online": true
}
```

### 2. Format RSS requis
Les actualités doivent être au format RSS 2.0 avec les namespaces suivants :
- `xmlns:content` : Pour le contenu HTML enrichi
- `xmlns:dc` : Pour les métadonnées (auteur)
- `xmlns:slash` : Pour les commentaires

## 🔧 Comment ajouter une actualité

### Structure d'un item RSS :

```xml
<item>
    <title>Titre de l'actualité</title>
    <link>https://votre-site.com/news/url-unique</link>
    <guid>https://votre-site.com/news/url-unique</guid>
    <description>Description courte de l'actualité</description>
    <pubDate>Fri, 20 Dec 2024 10:15:00 +0000</pubDate>
    <enclosure url="https://votre-site.com/image.png" length="524288" type="image/png"/>
    <content:encoded><![CDATA[
        <h2>Titre avec HTML</h2>
        <p>Contenu riche avec <strong>formatage</strong></p>
        <ul>
            <li>Liste à puces</li>
            <li>Avec émojis 🎉</li>
        </ul>
    ]]></content:encoded>
    <dc:creator>Nom de l'auteur</dc:creator>
    <slash:comments>0</slash:comments>
</item>
```

### Champs obligatoires :
- **title** : Titre de l'actualité
- **link** : URL unique de l'actualité
- **guid** : Identifiant unique (généralement identique au link)
- **description** : Résumé court
- **pubDate** : Date de publication (format RFC 2822)
- **content:encoded** : Contenu HTML complet
- **dc:creator** : Auteur de l'actualité

### Champs optionnels :
- **enclosure** : Image associée (avec URL, taille et type)
- **slash:comments** : Nombre de commentaires

## 🎨 Formatage du contenu

### HTML supporté dans content:encoded :
- `<h1>`, `<h2>`, `<h3>` : Titres
- `<p>` : Paragraphes
- `<strong>`, `<em>` : Texte en gras/italique
- `<ul>`, `<ol>`, `<li>` : Listes
- `<a href="">` : Liens
- `<img src="">` : Images
- Styles CSS inline

### Émojis et caractères spéciaux :
✅ Supportés nativement : 🎉 ⚔️ 🎄 🎁 ❄️ 🦌 🍪

## 📅 Format de date

Utilisez le format RFC 2822 :
```
Fri, 20 Dec 2024 10:15:00 +0000
```

Générateurs en ligne disponibles ou utilisez JavaScript :
```javascript
new Date().toUTCString()
```

## 🖼️ Images

### Enclosure (image principale) :
```xml
<enclosure url="https://votre-site.com/image.png" length="524288" type="image/png"/>
```

### Images dans le contenu :
```html
<img src="https://votre-site.com/image.jpg" alt="Description" style="max-width: 100%;">
```

## 🔄 Mise à jour des actualités

### Méthodes :

1. **CMS/Backend** : Si vous avez un système de gestion de contenu
2. **Fichier statique** : Modifier directement le fichier RSS
3. **API** : Générer dynamiquement le flux RSS

### Ordre d'affichage :
Les actualités sont triées par date (`pubDate`) - les plus récentes en premier.

## 🧪 Test des actualités

1. Vérifiez la validité XML : [W3C Feed Validator](https://validator.w3.org/feed/)
2. Testez l'encodage UTF-8 pour les caractères français
3. Vérifiez l'affichage dans le launcher (F12 pour les logs)

## 📝 Exemples complets

### Exemples basiques
Voir le fichier `example_news.xml` pour des exemples d'actualités formatées correctement.

### Exemples inspirés de PokéMoonX
Voir le fichier `cryoclient_news.xml` pour des actualités dans le style de PokéMoonX :
- **Recrutement staff** - Avec formatage coloré et liens Discord
- **Nouvelle version** - Avec gradient CSS et changelog
- **Concours communautaire** - Avec récompenses et dates
- **Maintenance programmée** - Avec alertes visuelles et conseils

## 🚨 Points importants

- **Encodage** : Toujours utiliser UTF-8
- **CDATA** : Encapsuler le HTML dans `<![CDATA[...]]>`
- **URLs uniques** : Chaque actualité doit avoir un GUID unique
- **Validation** : Tester le flux RSS avant publication
- **Cache** : Le launcher peut mettre en cache, prévoir un délai de mise à jour

## 🔧 Dépannage

### Actualités non affichées :
1. Vérifier l'URL dans `config.json`
2. Contrôler la validité du XML
3. Vérifier les logs du launcher (F12)
4. Tester l'accès direct au flux RSS

### Caractères mal affichés :
1. Vérifier l'encodage UTF-8
2. Utiliser les entités HTML si nécessaire
3. Tester avec des caractères spéciaux

---

*Ce guide est basé sur l'implémentation Luuxis Selvania-Launcher*