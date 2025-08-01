import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

const CountriesSection = () => {
  const [showAllCountries, setShowAllCountries] = useState(false);
  
  // Combine all countries into one array, prioritizing African countries first
  const allCountries = [
    // African Countries (first 8 - first row)
    { name: "Nigeria", flag: "🇳🇬", code: "NG" },
    { name: "Kenya", flag: "🇰🇪", code: "KE" },
    { name: "Ghana", flag: "🇬🇭", code: "GH" },
    { name: "South Africa", flag: "🇿🇦", code: "ZA" },
    { name: "Tanzania", flag: "🇹🇿", code: "TZ" },
    { name: "Uganda", flag: "🇺🇬", code: "UG" },
    { name: "Ethiopia", flag: "🇪🇹", code: "ET" },
    { name: "Morocco", flag: "🇲🇦", code: "MA" },
    // Major Global Countries (next 8 - second row)
    { name: "United States", flag: "🇺🇸", code: "US" },
    { name: "United Kingdom", flag: "🇬🇧", code: "GB" },
    { name: "Canada", flag: "🇨🇦", code: "CA" },
    { name: "Australia", flag: "🇦🇺", code: "AU" },
    { name: "Germany", flag: "🇩🇪", code: "DE" },
    { name: "France", flag: "🇫🇷", code: "FR" },
    { name: "Japan", flag: "🇯🇵", code: "JP" },
    { name: "China", flag: "🇨🇳", code: "CN" },
    // Additional countries for when "See all" is clicked
    { name: "Egypt", flag: "🇪🇬", code: "EG" },
    { name: "Algeria", flag: "🇩🇿", code: "DZ" },
    { name: "Sudan", flag: "🇸🇩", code: "SD" },
    { name: "Angola", flag: "🇦🇴", code: "AO" },
    { name: "Mozambique", flag: "🇲🇿", code: "MZ" },
    { name: "Madagascar", flag: "🇲🇬", code: "MG" },
    { name: "Cameroon", flag: "🇨🇲", code: "CM" },
    { name: "Côte d'Ivoire", flag: "🇨🇮", code: "CI" },
    { name: "India", flag: "🇮🇳", code: "IN" },
    { name: "Brazil", flag: "🇧🇷", code: "BR" },
    { name: "Mexico", flag: "🇲🇽", code: "MX" },
    { name: "Italy", flag: "🇮🇹", code: "IT" },
    { name: "Spain", flag: "🇪🇸", code: "ES" },
    { name: "Netherlands", flag: "🇳🇱", code: "NL" },
    { name: "Switzerland", flag: "🇨🇭", code: "CH" },
    { name: "Sweden", flag: "🇸🇪", code: "SE" },
    { name: "Niger", flag: "🇳🇪", code: "NE" },
    { name: "Burkina Faso", flag: "🇧🇫", code: "BF" },
    { name: "Mali", flag: "🇲🇱", code: "ML" },
    { name: "Malawi", flag: "🇲🇼", code: "MW" },
    { name: "Zambia", flag: "🇿🇲", code: "ZM" },
    { name: "Senegal", flag: "🇸🇳", code: "SN" },
    { name: "Chad", flag: "🇹🇩", code: "TD" },
    { name: "Somalia", flag: "🇸🇴", code: "SO" },
    { name: "Zimbabwe", flag: "🇿🇼", code: "ZW" },
    { name: "Guinea", flag: "🇬🇳", code: "GN" },
    { name: "Rwanda", flag: "🇷🇼", code: "RW" },
    { name: "Benin", flag: "🇧🇯", code: "BJ" },
    { name: "Burundi", flag: "🇧🇮", code: "BI" },
    { name: "Tunisia", flag: "🇹🇳", code: "TN" },
    { name: "South Sudan", flag: "🇸🇸", code: "SS" },
    { name: "Togo", flag: "🇹🇬", code: "TG" },
    { name: "Sierra Leone", flag: "🇸🇱", code: "SL" },
    { name: "Libya", flag: "🇱🇾", code: "LY" },
    { name: "Congo", flag: "🇨🇬", code: "CG" },
    { name: "Central African Republic", flag: "🇨🇫", code: "CF" },
    { name: "Liberia", flag: "🇱🇷", code: "LR" },
    { name: "Mauritania", flag: "🇲🇷", code: "MR" },
    { name: "Eritrea", flag: "🇪🇷", code: "ER" },
    { name: "Gambia", flag: "🇬🇲", code: "GM" },
    { name: "Botswana", flag: "🇧🇼", code: "BW" },
    { name: "Namibia", flag: "🇳🇦", code: "NA" },
    { name: "Gabon", flag: "🇬🇦", code: "GA" },
    { name: "Lesotho", flag: "🇱🇸", code: "LS" },
    { name: "Guinea-Bissau", flag: "🇬🇼", code: "GW" },
    { name: "Equatorial Guinea", flag: "🇬🇶", code: "GQ" },
    { name: "Mauritius", flag: "🇲🇺", code: "MU" },
    { name: "Eswatini", flag: "🇸🇿", code: "SZ" },
    { name: "Djibouti", flag: "🇩🇯", code: "DJ" },
    { name: "Comoros", flag: "🇰🇲", code: "KM" },
    { name: "Cabo Verde", flag: "🇨🇻", code: "CV" },
    { name: "São Tomé and Príncipe", flag: "🇸🇹", code: "ST" },
    { name: "Seychelles", flag: "🇸🇨", code: "SC" },
    { name: "Norway", flag: "🇳🇴", code: "NO" },
    { name: "Denmark", flag: "🇩🇰", code: "DK" },
    { name: "Finland", flag: "🇫🇮", code: "FI" },
    { name: "Belgium", flag: "🇧🇪", code: "BE" },
    { name: "Austria", flag: "🇦🇹", code: "AT" },
    { name: "Poland", flag: "🇵🇱", code: "PL" },
    { name: "Czech Republic", flag: "🇨🇿", code: "CZ" },
    { name: "Hungary", flag: "🇭🇺", code: "HU" },
    { name: "Portugal", flag: "🇵🇹", code: "PT" },
    { name: "Greece", flag: "🇬🇷", code: "GR" },
    { name: "Ireland", flag: "🇮🇪", code: "IE" },
    { name: "New Zealand", flag: "🇳🇿", code: "NZ" },
    { name: "Singapore", flag: "🇸🇬", code: "SG" },
    { name: "South Korea", flag: "🇰🇷", code: "KR" },
    { name: "Thailand", flag: "🇹🇭", code: "TH" },
    { name: "Malaysia", flag: "🇲🇾", code: "MY" },
    { name: "Indonesia", flag: "🇮🇩", code: "ID" },
    { name: "Philippines", flag: "🇵🇭", code: "PH" },
    { name: "Vietnam", flag: "🇻🇳", code: "VN" },
    { name: "Turkey", flag: "🇹🇷", code: "TR" },
    { name: "Israel", flag: "🇮🇱", code: "IL" },
    { name: "Saudi Arabia", flag: "🇸🇦", code: "SA" },
    { name: "United Arab Emirates", flag: "🇦🇪", code: "AE" },
    { name: "Qatar", flag: "🇶🇦", code: "QA" },
    { name: "Kuwait", flag: "🇰🇼", code: "KW" },
    { name: "Bahrain", flag: "🇧🇭", code: "BH" },
    { name: "Oman", flag: "🇴🇲", code: "OM" },
    { name: "Jordan", flag: "🇯🇴", code: "JO" },
    { name: "Lebanon", flag: "🇱🇧", code: "LB" },
    { name: "Democratic Republic of the Congo", flag: "🇨🇩", code: "CD" },
    { name: "Republic of the Congo", flag: "🇨🇬", code: "CG" }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Send & receive money from 100+ countries
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our global network spans across continents, connecting you with customers and partners worldwide.
          </p>
        </div>

        {/* Countries */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-6 h-6 text-blue-primary" />
            <h3 className="text-2xl font-bold text-foreground">Countries</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {(showAllCountries ? allCountries : allCountries.slice(0, 16)).map((country) => (
              <Card key={country.code} className="group hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="text-2xl mb-2">{country.flag}</div>
                  <div className="text-xs font-medium text-foreground group-hover:text-blue-primary transition-colors">
                    {country.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {!showAllCountries && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowAllCountries(true)}
                className="group hover:shadow-glow transition-all duration-300"
              >
                See all countries
                <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection; 