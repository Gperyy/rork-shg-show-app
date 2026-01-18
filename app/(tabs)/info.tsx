import { ChevronDown, ChevronUp, MapPin, Phone, Mail, ExternalLink } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { InstagramIcon, FacebookIcon, YoutubeIcon, XIcon } from "@/components/CustomIcons";

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    q: "Çocuklar için yaş sınırı var mı?",
    a: "Organizasyonumuz tüm yaş grupları için uygundur; 6 yaş ve altı çocuklar ücretsizdir.",
  },
  {
    q: "Biletler ve Gösteriye Giriş",
    a: "SHG Airshow'a giriş işlemlerinizin hızlıca tamamlanabilmesi için biletlerinizi organizasyon öncesinde indirmenizi tavsiye ederiz. Biletlerinize e-posta, SMS veya Biletinial mobil uygulaması üzerinden ulaşabilirsiniz. Ayrıca, organizasyon günlerinde alanda bulunan SHG gişelerimizden de bilet satın alabilirsiniz.",
  },
  {
    q: "Ücretsiz Giriş",
    a: "Gazi, engelli ve basın kartı sahipleri için girişler ücretsizdir. Türk Silahlı Kuvvetleri (Hava, Deniz ve Kara Kuvvetleri), Jandarma Genel Komutanlığı ve Emniyet Teşkilatı personeli, kimlik ibraz etmek kaydıyla şahsen ücretsiz giriş yapabilirler. Beraberindeki aile fertleri ise ücrete tabidir.",
  },
  {
    q: "Otopark mevcut mu?",
    a: "Etkinlik alanında ücretsiz otopark alanları mevcuttur. Ayrıca, VIP bilet alan seyircilerimiz için özel otopark alanı ayrılmıştır.",
  },
  {
    q: "Yanınıza Almanızı Tavsiye Ettiklerimiz",
    a: "Sivrihisar Hava Gösterileri'ni kesintisiz seyredebilmek için güneş gözlüğü, şapka ve güneş kreminizi yanınızda bulundurmanızı öneririz.",
  },
  {
    q: "Seyahat ve Gösteri Günü Ulaşım",
    a: "Gösteri alanına ulaşım için navigasyon uygulamalarında lütfen 'Sivrihisar Havacılık Merkezi' konumunu hedefleyin. Bölgeye ulaştığınızda yol kenarındaki 'SHG Airshow' tabelaları size rehberlik edecektir. Ayrıca, Sivrihisar Belediye Binası önünden hareket eden ücretsiz ring seferlerini kullanarak ulaşım sağlayabilirsiniz.",
  },
  {
    q: "Bebek Bakım Odası var mı?",
    a: "Minik seyircilerimizin ve ailelerinin ihtiyaçları düşünülerek, SHG'de bebek bakım odası hizmeti ziyaretçilerimizin kullanımına sunulmaktadır.",
  },
  {
    q: "Acil Durum ve Güvenlik",
    a: "SHG alanında güvenlik ve itfaiye ekipleri hazır bulunmakta olup, olası acil durumlarda hızlı ve etkili müdahale sağlanmaktadır.",
  },
  {
    q: "Engelli Ziyaretçi hizmetleri",
    a: "SHG'de Engelli Ziyaretçilerimiz için giriş kolaylıkları sağlanmakta ve 'engelli tuvaletleri' bulunmaktadır.",
  },
  {
    q: "Evcil hayvan kabul ediyor musunuz?",
    a: "Airshow'a sevimli dostlarınızla katılabilirsiniz. Evcil hayvanlar sahibi sorumluluğunda ve tasması takılı şekilde bulundurmalıdır.",
  },
  {
    q: "Sağlık hizmetleri",
    a: "Alan içerisinde revir, doktor ve ambulans hizmetleri mevcuttur; her türlü acil durumda profesyonel destek sağlanmaktadır.",
  },
  {
    q: "Kamp Alanı Mevcut Mu?",
    a: "Organizasyon alanının çevresinde, kamp yapmak isteyen misafirlerimiz için özel olarak ayrılmış bir alan bulunmaktadır. Kamp alanında portatif tuvaletler yer almaktadır. Airshow heyecanını gün boyu yaşamak ve etkinliğin atmosferini kamp deneyimiyle birleştirmek isteyen katılımcılar için bu alan tahsis edilmiştir.",
  },
];

const GOOGLE_MAPS_URL = "https://www.google.com/maps/dir//Sivrihisar+Havacılık+Merkezi+Yeşilköy+26600+Sivrihisar%2FEskişehir/@39.2970257,31.4861193,17z/data=!4m5!4m4!1m0!1m2!1m1!1s0x14cdfd073d852337:0xd2f34784f222f435";

const FAQAccordion = ({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) => {
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestionText}>{item.q}</Text>
        {isOpen ? (
          <ChevronUp color={Colors.live} size={20} />
        ) : (
          <ChevronDown color={Colors.textSecondary} size={20} />
        )}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.a}</Text>
        </View>
      )}
    </View>
  );
};

export default function InfoScreen() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleOpenMaps = () => {
    Linking.openURL(GOOGLE_MAPS_URL);
  };

  const handleCall = () => {
    Linking.openURL("tel:+903122223344");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:info@shgairshow.com");
  };

  const handleSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bilgi</Text>
          <Text style={styles.headerSubtitle}>SHG Airshow 2026</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Transportation Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ulaşım</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <MapPin color={Colors.live} size={20} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Etkinlik Alanı</Text>
                  <Text style={styles.infoText}>
                    Sivrihisar Havacılık Merkezi{"\n"}
                    Yeşilköy, 26600{"\n"}
                    Sivrihisar / Eskişehir
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={handleOpenMaps}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.live, '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.mapButtonGradient}
                >
                  <ExternalLink color={Colors.white} size={18} />
                  <Text style={styles.mapButtonText}>Google Maps'te Aç</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.transportNote}>
                Navigasyon uygulamalarında "Sivrihisar Havacılık Merkezi" konumunu hedefleyin.
                Sivrihisar Belediye Binası önünden hareket eden ücretsiz ring seferlerini de kullanabilirsiniz.
              </Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İletişim</Text>
            <View style={styles.infoCard}>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Phone color={Colors.live} size={20} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Telefon</Text>
                  <Text style={styles.contactValue}>+90 312 222 33 44</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.contactRow}
                onPress={handleEmail}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Mail color={Colors.live} size={20} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>E-posta</Text>
                  <Text style={styles.contactValue}>info@shgairshow.com</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.socialSection}>
                <Text style={styles.socialTitle}>Sosyal Medya</Text>
                <View style={styles.socialButtons}>
                  <TouchableOpacity
                    style={styles.socialIconButton}
                    onPress={() => handleSocialMedia("https://www.instagram.com/sivrihisarhavagosterileri/")}
                    activeOpacity={0.7}
                  >
                    <InstagramIcon color={Colors.white} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.socialIconButton}
                    onPress={() => handleSocialMedia("https://www.facebook.com/sivrihisarhavagosterileri?locale=tr_TR")}
                    activeOpacity={0.7}
                  >
                    <FacebookIcon color={Colors.white} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.socialIconButton}
                    onPress={() => handleSocialMedia("https://www.youtube.com/@SHGAIRSHOWS")}
                    activeOpacity={0.7}
                  >
                    <YoutubeIcon color={Colors.white} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.socialIconButton}
                    onPress={() => handleSocialMedia("https://x.com/SHG_Airshow?lang=tr")}
                    activeOpacity={0.7}
                  >
                    <XIcon color={Colors.white} size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sıkça Sorulan Sorular</Text>
            <View style={styles.faqContainer}>
              {FAQ_DATA.map((item, index) => (
                <FAQAccordion
                  key={index}
                  item={item}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "rgba(30, 58, 95, 0.5)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
    lineHeight: 22,
  },
  mapButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  mapButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 10,
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.white,
  },
  transportNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 12,
  },
  socialSection: {
    marginTop: 8,
  },
  socialTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  socialIconButton: {
    flex: 1,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  faqContainer: {
    backgroundColor: "rgba(30, 58, 95, 0.5)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    overflow: "hidden",
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
